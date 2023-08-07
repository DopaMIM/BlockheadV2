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

    mapping(uint256 => Accounts) public accountsByNumber;
    mapping(address => uint256[]) public accountsByAddress;
 mapping(address => mapping(uint256 => uint256)) private accountNumberByAddressAndId;


    address public owner;
    uint256 public totalAccounts;
    address public duh;
    address public sequencerAddress;
    uint256 public automationFee;
    address public duhOracle;
    uint256[] public cancelledAccounts;

    event AccountCreated(address indexed customer);
    event AccountCancelled(uint256 indexed index, address indexed account);
    event TransactionSuccess(uint256 indexed index);

    constructor() {
        owner = msg.sender;

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
        require(accountNumberByAddressAndId[msg.sender][id] == 0, "Account already exists with the same sender and id");
        address _accountAddress = msg.sender;
        Accounts memory newAccount = Accounts(
            _accountAddress,
            id,
            automationFee,
            false
        );

        accountsByNumber[totalAccounts] = newAccount;
        accountsByAddress[_accountAddress].push(totalAccounts); // Add the new account number to the array
        accountNumberByAddressAndId[_accountAddress][id] = totalAccounts;
        totalAccounts++;
        emit AccountCreated(_accountAddress);

        transferFee();
    }

    //If transaction is ready to be triggered, nodes call trigger function
    function simpleAutomation(uint256 accountNumber)
        external
        hasSufficientTokens
        isCurrentNode
    {
        require(accountNumber < totalAccounts, "Invalid account number");

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
        return
            account.cancelled == false &&
            Automate(account.account).checkSimpleAutomation(account.id);
    }

    function getAccountsByAddress(address accountAddress)
        external
        view
        returns (uint256[] memory)
    {
        return accountsByAddress[accountAddress];
    }

    //Contracts call this function to cancel an account
    function cancelAccount(uint256 id) external {
      uint accountNumber =  accountNumberByAddressAndId[msg.sender][id];
        Accounts storage account = accountsByNumber[accountNumber];
        require(account.cancelled == false);
        require(
            msg.sender == account.account,
            "Only account creator can cancel account"
        );

        account.cancelled = true;
        cancelledAccounts.push(accountNumber);

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

    function setDuh(address _duh) external onlyOwner {
        duh = _duh;
    }

    function setSequencerAddress(address _sequencerAddress) external onlyOwner {
        sequencerAddress = _sequencerAddress;
    }

    function getCancelledAccounts() external view returns (uint256[] memory) {
        return cancelledAccounts;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");

        owner = newOwner;
    }
}
