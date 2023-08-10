//DOES NOT YET WORK AS INTENDED



pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

contract IncrementalTransfer {
    struct RecurringPayment {
        address sender;
        address recipient;
        uint256 amount;
        address token;
        uint256 lastPaymentTimestamp;
        address expectedToken;
        string[] data;
    }

    RecurringPayment[] public recurringPayments;

    event RecurringPaymentCreated(
        address indexed sender,
        address indexed recipient,
        uint256 indexed amount,
        address token,
        string[] data
    );

    address public owner;
    uint256 private incrementMultiplier;
    uint256 public totalPayments;
    uint256 public secondsDelay;
    address private WMATIC = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private _uniswapRouterAddress =
        0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;

    constructor() {
        owner = msg.sender;
        incrementMultiplier = 1;
        secondsDelay = 300;
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
        address _expectedToken,
        string[] memory _data
    ) external {
        require(_amount > 0, "Payment amount must be greater than zero");
        address _sender = msg.sender;
        RecurringPayment memory payment = RecurringPayment(
            _sender,
            _recipient,
            _amount,
            _token,
            block.timestamp,
            _expectedToken,
            _data
        );
        recurringPayments.push(payment);

        totalPayments++;

        emit RecurringPaymentCreated(
            _sender,
            _recipient,
            _amount,
            _token,
            payment.data
        );
    }

    function transferFunds(uint256 index) external {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];

        require(
            block.timestamp >= payment.lastPaymentTimestamp + secondsDelay,
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
                address(this),
                paymentAmount
            ),
            "Token transfer failed."
        );
        require(
            IERC20(payment.token).transferFrom(
                payment.sender,
                address(this),
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
        address DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;

        executeTrade(
            paymentAmount,
            payment.token,
            payment.expectedToken,
            payment.recipient
        );
        executeTrade(contractFee, payment.token, DAI, owner);

        payment.lastPaymentTimestamp = block.timestamp;
    }

    function getCurrentBlockTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    function updateSecondsDelay(uint256 _secondsDelay) external onlyOwner {
        secondsDelay = _secondsDelay;
    }

    function nextPaymentDue(uint256 index) external view returns (uint256) {
        require(index < totalPayments, "Invalid payment index");

        RecurringPayment storage payment = recurringPayments[index];
        require(payment.sender != address(0), "Payment does not exist");

        return payment.lastPaymentTimestamp + secondsDelay;
    }

    function executeTrade(
        uint256 amountIn,
        address recipient,
        address _token1,
        address _token2
    ) internal {
        IERC20 token1 = IERC20(_token1);

        IUniswapV2Router02 uniswapRouter = IUniswapV2Router02(
            _uniswapRouterAddress
        );

        token1.approve(_uniswapRouterAddress, amountIn);

        address[] memory path;
        if (_token1 == WMATIC || _token2 == WMATIC) {
            path = new address[](2);
            path[0] = _token1;
            path[1] = _token2;
        } else {
            path = new address[](3);
            path[0] = _token1;
            path[1] = WMATIC;
            path[2] = _token2;
        }

        uint256[] memory amountsOut = uniswapRouter.getAmountsOut(
            amountIn,
            path
        );

        uint256 amountOutMin = (amountsOut[amountsOut.length - 1] * 99) / 100;

        uniswapRouter.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            recipient,
            block.timestamp
        );
    }
}
