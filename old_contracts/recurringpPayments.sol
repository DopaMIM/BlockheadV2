pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract IncrementalTransfer {
    struct RecurringPayment {
        address sender;
        address recipient;
        uint256 amount;
        address token;
        uint256 lastPaymentTimestamp;
    }

    RecurringPayment[] public recurringPayments;

    event RecurringPaymentCreated(
        address indexed sender,
        address indexed recipient,
        uint256 indexed amount,
        address token,
        uint256 incrementMultiplier
    );

    address public owner;
    uint256 public incrementMultiplier;
    uint256 public totalPayments;

    constructor() {
        owner = msg.sender;
        incrementMultiplier = 1;
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
        address _token
    ) external {
        require(_amount > 0, "Payment amount must be greater than zero");
        address _sender = msg.sender;
        RecurringPayment memory payment = RecurringPayment(
            _sender,
            _recipient,
            _amount,
            _token,
            block.timestamp
        );
        recurringPayments.push(payment);

        totalPayments++;

        emit RecurringPaymentCreated(
            _sender,
            _recipient,
            _amount,
            _token,
            incrementMultiplier
        );
    }

    function transferFunds(uint256 index) external {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];
        

        require(
            block.timestamp >= payment.lastPaymentTimestamp + 100,
            "Not enough time has passed since the last transfer."
        );
        uint256 paymentAmount = (payment.amount * 99) / 100;
        uint256 fee = payment.amount - paymentAmount;
        uint256 contractFee = fee / 2;
        uint256 callerFee = fee / 2;
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
                owner,
                contractFee
            ),
            "Contract fee Token transfer failed."
        );
        require(
            IERC20(payment.token).transferFrom(
                payment.sender,
                msg.sender,
                callerFee
            ),
            "Caller fee Token transfer failed."
        );

        payment.lastPaymentTimestamp = block.timestamp;
    }

    function getCurrentBlockTimestamp() external view returns (uint256) {
        return block.timestamp;
    }
}
