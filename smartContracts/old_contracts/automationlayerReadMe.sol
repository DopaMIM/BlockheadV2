

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

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);
}

interface AutomationLayer {
    function createAccount(uint256 id) external;

    function cancelAccount(uint256 id) external;
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

    //RecurringPayment[] public recurringPayments;

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
    address public automationLayerAddress;
    uint256 public serviceFee = 9900;
    uint256 public precission = 10000;
    uint256 public feeSplit = 5000;
    uint256[] public cancelledAccounts;

    mapping(uint256 => RecurringPayment) public recurringPayments;
    mapping(address => uint256[]) internal accountNumberByAddress;

    constructor() {
        owner = msg.sender;
        duh = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
        // duh = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
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

        uint256 paymentDue = block.timestamp + _freeTrialTimeInSeconds;
        uint256 accountNumber = totalPayments;

        AutomationLayer(automationLayerAddress).createAccount(accountNumber);

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

        totalPayments++;

        recurringPayments[accountNumber] = payment; // Store payment details in the mapping
        accountNumberByAddress[_sender].push(accountNumber); // Store account number for the sender address
        accountNumberByAddress[_recipient].push(accountNumber); // Store account number for the recipient address
        accountNumberByAddress[_interface].push(accountNumber); // Store account number for the interface address
        accountNumberByAddress[_token].push(accountNumber); // Store account number for the token address

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

    function simpleAutomation(uint256 id) external {
        transferFunds(id);
    }

    
    function cancelAutomatedAccount(uint256 uniqueID) public {

        AutomationLayer(automationLayerAddress).cancelAccount(uniqueID);

    }
    function transferFunds(uint256 accountNumber) public {
        RecurringPayment storage payment = recurringPayments[accountNumber];
        require(!payment.canceled, "The recurring payment has been canceled.");

        require(
            block.timestamp >= payment.paymentDue,
            "Not enough time has passed since the last transfer."
        );
        payment.paymentDue += payment.timeIntervalSeconds;

        emit PaymentTransferred(accountNumber);
        uint256 fee = (payment.amount * serviceFee) / precission;
        uint256 paymentAmount = payment.amount - fee;
        uint256 interfaceFee = (fee * feeSplit) / precission;
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

    function automateMe() external {
        AutomationLayer(automationLayerAddress).createAccount(uniqueID)
        uniqueID++
           }

     function simpleAutomation(uint256 uniqueID)external{
        yourFunctionToBeAutomated(uniqueID)
     }
    
     function checkSimpleAutomation(uint256 uniqueID)
        external
        view
        returns (bool)
    {

        return
           isFunctionReadyToBeCalled(uniqueID)
    }


    function getAccountNumbersByAddress(address accountAddress)
        external
        view
        returns (uint256[] memory)
    {
        return accountNumberByAddress[accountAddress];
    }

    function getCurrentBlockTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    function getPaymentDue(uint256 accountNumber)
        external
        view
        returns (uint256)
    {
        require(accountNumber < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[accountNumber];

        return payment.paymentDue;
    }

    function checkSimpleAutomation(uint256 accountNumber)
        external
        view
        returns (bool)
    {
        RecurringPayment storage payment = recurringPayments[accountNumber];
        require(payment.canceled == false, "Subscription Cancelled");
        return
            payment.paymentDue < block.timestamp && payment.canceled == false;
    }

    function cancelRecurringPayment(uint256 accountNumber) external {
        require(accountNumber < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[accountNumber];

        require(
            msg.sender == payment.sender ||
                msg.sender == payment.recipient ||
                msg.sender == owner,
            "Only the payment sender or recipient can cancel the recurring payment."
        );

        payment.canceled = true;
        cancelledAccounts.push(accountNumber);
        AutomationLayer(automationLayerAddress).cancelAccount(accountNumber);

        emit RecurringPaymentCancelled(
            accountNumber,
            payment.sender,
            payment.recipient
        );
    }

    function isSubscriptionValid(uint256 accountNumber)
        external
        view
        returns (bool)
    {
        require(accountNumber < totalPayments, "Invalid payment accountNumber");

        RecurringPayment storage payment = recurringPayments[accountNumber];

        uint256 oneDayInSeconds = 24 * 60 * 60; // Number of seconds in a day

        return payment.paymentDue + oneDayInSeconds > block.timestamp;
    }

    function isPaymentCanceled(uint256 accountNumber)
        external
        view
        returns (bool)
    {
        require(accountNumber < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[accountNumber];

        return payment.canceled;
    }

    function getAdditionalInformation(uint256 accountNumber)
        external
        view
        returns (string[] memory)
    {
        require(accountNumber < totalPayments, "Invalid accountNumber");

        RecurringPayment storage payment = recurringPayments[accountNumber];

        return payment.additionalInformation;
    }

    function setAutomationLayerAddress(address _automationLayerAddress)
        external
        onlyOwner
    {
        automationLayerAddress = _automationLayerAddress;
    }

    function approveAutomationFee(uint256 approvalAmount) external onlyOwner {
        require(
            IERC20(duh).approve(automationLayerAddress, approvalAmount),
            "failed to approve token spend"
        );
    }

    function getCancelledAccounts() external view returns (uint256[] memory) {
        return cancelledAccounts;
    }

    function setServiceFee(uint256 _serviceFee) external onlyOwner {
        serviceFee = _serviceFee;
    }

    function setFeeSplit(uint256 _feeSplit) external onlyOwner {
        feeSplit = _feeSplit;
    }

    function withdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");

        require(
            IERC20(token).transfer(owner, balance),
            "Token transfer failed"
        );
    }

    function setDuhAddress(address _duh) external onlyOwner {
        duh = _duh;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");

        owner = newOwner;
    }
}
