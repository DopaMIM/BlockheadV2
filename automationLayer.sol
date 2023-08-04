// SPDX-License-Identifier: UNLICENSED
// This code is proprietary and confidential. All rights reserved.
// Proprietary code by Levi Webb

pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);
}

interface Automate {
    function simpleAutomation(uint256 id) external;

    function checkSimpleAutomation(uint256 id) external view returns (bool);
}

interface sequencer {
    function getCurrentNode() external view returns (address);

    function hasSufficientTokens() external view returns (bool);

    function minimumDuh() external view returns (uint256);
}

contract AutomationLayer {
    struct Accounts {
        address account;
        uint256 id;
        uint256 accountCreationFee;
        bool cancelled;
    }

    mapping(address => bool) public isNodeRegistered;
    mapping(uint256 => Accounts) public accountsByNumber;
    mapping(address => uint256[]) public accountsByAddress;

    address public owner;
    uint256 public totalAccounts;
    address public duh;
    uint256 public minimumDuh;
    address public sequencerAddress;
    address public WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    uint256 public automationFee;
    address public duhOracle;

    event AccountCreated(address indexed customer);
    event AccountCancelled(uint256 indexed index, address indexed account);
    event TransactionSuccess(uint256 indexed index);

    constructor() {
        owner = msg.sender;
        minimumDuh = 0;

        duh = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174; //USDC on Polygon
        // duh = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; //WETH on Ethereum
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }
        modifier onlyOracle() {
        require(
            msg.sender == duhOracle,
            "Only the oracle can call this function."
        );
        _;
    }
    
    // check to see if nodes have enough tokens to be valid nodes
    modifier hasSufficientTokens() {
        require(
            sequencer(sequencerAddress).hasSufficientTokens() == true,
            "Insufficient token balance."
        );
        _;
    }
    //Checks with sequencer to ensure nodes are taking turns
    modifier isCurrentNode() {
        require(
            tx.origin == sequencer(sequencerAddress).getCurrentNode(),
            "Not current node"
        );
        _;
    }

    //contracts call create account to register a new account to be automated
    function createAccount(uint256 id) external {
        address _accountAddress = msg.sender;
        Accounts memory newAccount = Accounts(
            _accountAddress,
            id,
            automationFee,
            false
        );

        accountsByNumber[totalAccounts] = newAccount;
        accountsByAddress[_accountAddress].push(totalAccounts); // Add the new account number to the array
        totalAccounts++;
        emit AccountCreated(_accountAddress);
    }

    //If transaction is ready to be triggered, nodes call trigger function
    function simpleAutomation(uint256 accountNumber)
        external
        hasSufficientTokens
        isCurrentNode
    {
        require(accountNumber < totalAccounts, "Invalid account index");

        Accounts storage account = accountsByNumber[accountNumber];
        require(!account.cancelled, "The profile has been canceled.");

        emit TransactionSuccess(accountNumber);

        Automate(account.account).simpleAutomation(account.id);
        // Transfer the tokens
          require(
            IERC20(duh).transferFrom(account.account, tx.origin, automationFee),
            "Fee transfer failed."
        );
        
    }

    function transferFee() internal {
        IERC20(duh).transferFrom(msg.sender, owner, automationFee);
    }

    // check to se if tranaction is ready to be triggered
    function checkSimpleAutomation(uint256 accountNumber)
        external
        view
        returns (bool)
    {
        Accounts storage account = accountsByNumber[accountNumber];
        return account.cancelled==false && Automate(account.account).checkSimpleAutomation(account.id);
    }

    function getAccountsByAddress(address accountAddress)
        external
        view
        returns (uint256[] memory)
    {
        return accountsByAddress[accountAddress];
    }

    //Contracts call this function to cancel an account
    function cancelAccount(uint256 accountNumber) external {
        Accounts storage account = accountsByNumber[accountNumber];
        require(account.cancelled == false);
        require(
            msg.sender == account.account,
            "Only account creator can cancel account"
        );

        account.cancelled = true;

        IERC20(duh).transferFrom(
            owner,
            account.account,
            account.accountCreationFee
        );

        emit AccountCancelled(accountNumber, account.account);
    }

    function setAutomationFee(uint256 _automationFee) external onlyOwner {
        automationFee = _automationFee;
    }

    function setAutomationFeeByOracle(uint256 _automationFee)
        external
        onlyOracle
    {
        automationFee = _automationFee;
    }

    //check if account has been cancelled before calling trigger
    function isAccountCanceled(uint256 accountNumber)
        external
        view
        returns (bool)
    {
        require(accountNumber < totalAccounts, "Invalid account index");

        Accounts storage account = accountsByNumber[accountNumber];

        return account.cancelled;
    }

    function setDuhOracle(address _DuhOracle) external onlyOwner {
        duhOracle = _DuhOracle;
    }

    function setSequencerAddress(address _sequencerAddress) external onlyOwner {
        sequencerAddress = _sequencerAddress;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");

        owner = newOwner;
    }
}
