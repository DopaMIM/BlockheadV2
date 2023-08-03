// SPDX-License-Identifier: UNLICENSED
// This code is proprietary and confidential. All rights reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited.
// Proprietary code by Levi Webb

pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface AutomationLayer {
    function createAccount() external returns (uint256);
}

contract RecurringPayments {
    struct RecurringPayment {
        uint256 accountNumber;
        address sender;
        address recipient;
        uint256 amount;
        address token;
        uint256 timeIntervalSeconds;
        address paymentInterface;
        string[] additionalInformation;
        uint256 paymentDue;
        bool canceled;
    }

    RecurringPayment[] public recurringPayments;

    event RecurringPaymentCreated(
        uint256 accountNumber,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        address token,
        uint256 timeIntervalSeconds,
        address indexed paymentInterface,
        string[] additionalInformation,
        uint256 paymentDue,
        bool canceled
    );
    event RecurringPaymentCancelled(
        uint256 indexed index,
        address indexed sender,
        address indexed recipient
    );
    event PaymentTransferred(uint256 indexed index);

    address public owner;
    uint256 public totalPayments;
    address public duh;
    uint256 public minimumDuh;
    address public automationLayerAddress;
    mapping(uint256 => uint256) public accountNumberToIndex;
    mapping(address => uint256[]) addressToIndices;

    constructor() {
        owner = msg.sender;
        minimumDuh = 0;
        duh = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }

    modifier hasSufficientTokens() {
        require(
            IERC20(duh).balanceOf(tx.origin) >= minimumDuh,
            "Insufficient token balance."
        );
        _;
    }

    function createRecurringPayment(
        address _recipient,
        uint256 _amount,
        address _token,
        uint256 _timeIntervalSeconds,
        address _interface,
        string[] memory _additionalInformation,
        uint256 _freeTrialTimeInSeconds
    ) external {
        require(_amount > 0, "Payment amount must be greater than zero");
        address _sender = msg.sender;
        totalPayments++;
        uint256 paymentDue = block.timestamp + _freeTrialTimeInSeconds;
        uint256 accountNumber = AutomationLayer(automationLayerAddress)
            .createAccount();
        RecurringPayment memory payment = RecurringPayment(
            accountNumber,
            _sender,
            _recipient,
            _amount,
            _token,
            _timeIntervalSeconds,
            _interface,
            _additionalInformation,
            paymentDue,
            false
        );
        recurringPayments.push(payment);

        addressToIndices[_sender].push(recurringPayments.length - 1);
        addressToIndices[_recipient].push(recurringPayments.length - 1);
        addressToIndices[_interface].push(recurringPayments.length - 1);
        addressToIndices[_token].push(recurringPayments.length - 1);
        accountNumberToIndex[accountNumber] = recurringPayments.length - 1;

        emit RecurringPaymentCreated(
            accountNumber,
            _sender,
            _recipient,
            _amount,
            _token,
            _timeIntervalSeconds,
            _interface,
            _additionalInformation,
            paymentDue,
            false
        );
    }

    function simpleAutomation(uint256 accountNumber) external {
        transferFunds(accountNumber);
    }

    function transferFunds(uint256 accountNumber) public {

        
        uint256 index = accountNumberToIndex[accountNumber];

        RecurringPayment storage payment = recurringPayments[index];
        require(!payment.canceled, "The recurring payment has been canceled.");

        require(
            block.timestamp >= payment.paymentDue,
            "Not enough time has passed since the last transfer."
        );
        payment.paymentDue += payment.timeIntervalSeconds;

        emit PaymentTransferred(index);

        uint256 paymentAmount = (payment.amount * 99) / 100;
        uint256 fee = payment.amount - paymentAmount;
        uint256 interfaceFee = fee / 2;
        uint256 contractFee = fee - interfaceFee;

        // Transfer the tokens
        require(
            IERC20(payment.token).transferFrom(
                payment.sender,
                payment.recipient,
                paymentAmount
            ),
            "Token transfer failed."
        );
        require(
            IERC20(payment.token).transferFrom(
                payment.sender,
                payment.paymentInterface,
                contractFee
            ),
            "contract fee Token transfer failed."
        );

        require(
            IERC20(payment.token).transferFrom(
                payment.sender,
                owner,
                contractFee
            ),
            "contract fee Token transfer failed."
        );
    }

    function getCurrentBlockTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    function getPaymentDue(uint256 index) external view returns (uint256) {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        return payment.paymentDue;
    }

    function checkSimpleAutomation(uint256 accountNumber) external view returns (bool) {
        uint256 index = accountNumberToIndex[accountNumber];

        RecurringPayment storage payment = recurringPayments[index];
        require(payment.canceled == false, "Subscription Cancelled");
        return payment.paymentDue < block.timestamp && payment.canceled == false;
    }

    function cancelRecurringPayment(uint256 index) external {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        require(
            msg.sender == payment.sender || msg.sender == payment.recipient,
            "Only the payment sender or recipient can cancel the recurring payment."
        );

        payment.canceled = true;

        emit RecurringPaymentCancelled(
            index,
            payment.sender,
            payment.recipient
        );
    }

    function getRecurringPaymentIndices(address account)
        external
        view
        returns (uint256[] memory)
    {
        return addressToIndices[account];
    }

    function isSubscriptionValid(uint256 index) external view returns (bool) {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        uint256 oneDayInSeconds = 24 * 60 * 60; // Number of seconds in a day

        return payment.paymentDue + oneDayInSeconds > block.timestamp;
    }

    function isPaymentCanceled(uint256 index) external view returns (bool) {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        return payment.canceled;
    }

    function getAdditionalInformation(uint256 index)
        external
        view
        returns (string[] memory)
    {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        return payment.additionalInformation;
    }

    function setAutomationLayerAddress(address _automationLayerAddress)
        external
        onlyOwner
    {
        automationLayerAddress = _automationLayerAddress;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");

        owner = newOwner;
    }
}
