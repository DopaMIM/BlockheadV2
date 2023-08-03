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

contract IncrementalTransfer {
    struct RecurringPayment {
        address sender;
        address recipient;
        uint256 amount;
        address token;
        uint256 timeIntervalSeconds;
        address paymentInterface;
        bytes[] data;
        uint256 paymentDue;
        bool canceled;
    }

    RecurringPayment[] public recurringPayments;

    event RecurringPaymentCreated(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        address token,
        uint256 timeIntervalSeconds,
        address indexed paymentInterface,
        bytes[] data,
        uint256 paymentDue,
        bool canceled
    );
    event RecurringPaymentCancelled(
        uint256 indexed index,
        address indexed sender,
        address indexed recipient
    );

    address public owner;
    uint256 public totalPayments;
    address public duh;
    uint256 public minimumDuh;

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
        bytes[] memory _data,
        bool _freeTrial
    ) external {
        require(_amount > 0, "Payment amount must be greater than zero");
        address _sender = msg.sender;
        totalPayments++;
        uint256 paymentDue;
        if (_freeTrial == true) {
            paymentDue = block.timestamp + _timeIntervalSeconds;
        } else {
            paymentDue = block.timestamp;
        }
        RecurringPayment memory payment = RecurringPayment(
            _sender,
            _recipient,
            _amount,
            _token,
            _timeIntervalSeconds,
            _interface,
            _data,
            paymentDue,
            false
        );
        recurringPayments.push(payment);

        emit RecurringPaymentCreated(
            _sender,
            _recipient,
            _amount,
            _token,
            _timeIntervalSeconds,
            _interface,
            _data,
            paymentDue,
            false
        );
    }

    function transferFunds(uint256 index) external {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];
        require(!payment.canceled, "The recurring payment has been canceled.");

        require(
            block.timestamp >= payment.paymentDue,
            "Not enough time has passed since the last transfer."
        );
        payment.paymentDue += payment.timeIntervalSeconds;

        uint256 paymentAmount = (payment.amount * 985) / 1000;
        uint256 fee = payment.amount - paymentAmount;
        uint256 interfaceFee = fee / 3;
        uint256 callerFee = fee / 3;
        uint256 contractFee = fee - interfaceFee - callerFee;

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
                msg.sender,
                callerFee
            ),
            "caller fee Token transfer failed."
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

    function getPaymentDue(uint256 index) external view returns (uint256) {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        return payment.paymentDue;
    }

    function isPaymentCanceled(uint256 index) external view returns (bool) {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        return payment.canceled;
    }

    function updateMinimumDuh(uint256 _minimumDuh) external onlyOwner {
        minimumDuh = _minimumDuh;
    }

    function setDuhAddress(address tokenAddress) external onlyOwner {
        duh = tokenAddress;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");

        owner = newOwner;
    }
}
