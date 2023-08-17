const { recurringPamentsNewest3ABI } = require("./recurringPaymentsABI"); //include wherever you put the abi
const { ethers } = require("ethers");
require("dotenv").config();

const providers = [           //you can simply use https://matic-mainnet.chainstacklabs.com if you do not already have providers
  process.env.POLYGON_WSS,  
  process.env.POLYGON_WSS2,
  process.env.POLYGON_WSS3,
  process.env.POLYGON_WSS4,
];
const randomProvider = Math.floor(Math.random() * providers.length);
const provider = new ethers.providers.WebSocketProvider(
  providers[randomProvider]
);

const recurringPaymentsContractAddress =
  "0xAD032f07245b7fD94d0EE1AF8dEb48a7C849F6DF";
console.log(provider.connection.url);

const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
const signer = wallet.connect(provider);
var recurringPaymentsContract = new ethers.Contract(
  recurringPaymentsContractAddress,
  recurringPamentsNewest3ABI,
  signer
);
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

//there are really only two write functions that the front end would need to call, createRecurringPayment, and cancelRecurringPayment
const notCalledFunctionsForDemonstrationOnly = async () => {
  //include transaction detals
  const estimateGas = 400000;

  const tx = {
    maxFeePerGas: (await provider.getGasPrice()) * 2,
    maxPriorityFeePerGas: 50000000000,
    gasLimit: estimateGas,
    nonce: provider.getTransactionCount(wallet.address, "pending"),
  };

  const createRecurringPayment =
    await recurringPaymentsContract.createRecurringPayment(
      recipientAddress, //Address of the reciever
      amount, // front end should convert to full currency units, but it must be submitted in the smalles units
      tokenAddress, // address of the ERC20 token to be transferred
      timeIntervalSeconds, // front end should show full days or weeks, but number must be submitted as seconds.
      interfaceAddress, // address of the frontend provider, this is where they will recieve thier fee
      [additionalInformation], // this is a string[] it can contain info such as business name, product name, service name, or any other information, but it must be submitted as a string. If none, just include empty []
      freeTrialInSeconds, // again front end should display in days/weeks/months, but free trial time length must be in seconds. if no free trial enter "0"
      tx //dont forget to include the tranaction details to ensure it is included in a block
    );


    const cancelRecurringPayment = await recurringPaymentsContract.cancelRecurringPayment(indexOfPaymentToBeCaceled, tx) // can only be called by profile sender or recipient
};

const init = async () => {
  // owner is contract owner
  const owner = await recurringPaymentsContract.owner();
  console.log("contract owner", owner);

  // duh is address of contract token, currently set to USDC address, but will be updated in the future
  const duh = await recurringPaymentsContract.duh();
  console.log("duh address", duh);

  // minimumDuh is the minimum number of duh tokens an address must have to call the transferFunds function
  const minimumDuh = await recurringPaymentsContract.minimumDuh();
  console.log("minimum duh", minimumDuh);

  // totalPayments is the total number of payment profiles in the array holding payment profiles
  const totalPaymentsIndex = await recurringPaymentsContract.totalPayments();
  console.log("totalPaymentsIndex", totalPaymentsIndex.toString());

  const userAddress = "0x0C88f6733cF9d0f5C9f6Cd5aB83E9A382f9909cd" //"0xeA9B8D8aD9668D0FdedE95333E816c36F2210fc0"; // Replace with the user's address you want to query

  // gets the rucrringPayments indices (uint)  related to the input address (sender, reciever, interface)
  const getRecurringPaymentIndices =
    await recurringPaymentsContract.getRecurringPaymentIndices(userAddress);
  console.log(
    "getRecurringPaymentIndices",
    getRecurringPaymentIndices.toString()
  );

 

  //Now lets loop through the returned indices
  let profileNumber = -1;
  while (profileNumber < getRecurringPaymentIndices.length - 1) {
    profileNumber = profileNumber + 1;
    console.log(profileNumber);
    // here is the call to get the recurring payment parameters
    const recurringPaymentProfile =
      await recurringPaymentsContract.recurringPayments(profileNumber);

    console.log("profile", profileNumber);
    console.log(recurringPaymentProfile);


    // Is Subscription Valid? If paymentDue + 1 Day  > currentCblock.timestamp returns true, else returns false
  const isSubscriptionValid = await recurringPaymentsContract.isSubscriptionValid(profileNumber)

  console.log("isSubscriptionValid", isSubscriptionValid)
    // You must call the additional information function seperately to get the string[] info

    const additionalInformation =
      await recurringPaymentsContract.getAdditionalInformation(profileNumber);
    console.log(additionalInformation);

    //find out when the next payment is due. firt get current blco.timestamp, then get PaymentDue
    const currentTimestamp =
      await recurringPaymentsContract.getCurrentBlockTimestamp();
    console.log("current timestamp", currentTimestamp.toString());

    const getPaymentDue = await recurringPaymentsContract.getPaymentDue(
      profileNumber
    );
    console.log("Payment Due", getPaymentDue.toString());

    // has the payment been canceled? returns bool
    const isPaymentCanceled = await recurringPaymentsContract.isPaymentCanceled(
      profileNumber
    );

    console.log("payment canceled", isPaymentCanceled);

    // if payment is due initiate transfer

    if (getPaymentDue < currentTimestamp && isPaymentCanceled == false) {
      const estimateGas = 400000;

      const tx = {
        maxFeePerGas: (await provider.getGasPrice()) * 2,
        maxPriorityFeePerGas: 50000000000,
        gasLimit: estimateGas,
        nonce: provider.getTransactionCount(wallet.address, "pending"),
      };

      const transferFunds = await recurringPaymentsContract.transferFunds(
        profileNumber,
        tx
      );
      console.log("submitting transfer", transferFunds);
      const receipt = await transferFunds.wait();

      if (receipt && receipt.blockNumber && receipt.status === 1) {
        // 0 - failed, 1 - success
        console.log(
          `Transfer https://polygonscan.com/tx/${receipt.transactionHash} mined, status success`
        );
      } else if (receipt && receipt.blockNumber && receipt.status === 0) {
        console.log(
          `Transfer https://polygonscan.com/tx/${receipt.transactionHash} mined, status failed`
        );
      } else {
        console.log(
          `Transfer https://polygonscan.com/tx/${receipt.transactionHash} not mined`
        );
      }
    }
  }

  // get user transaction history
  const networkProvider = new ethers.providers.EtherscanProvider(137, process.env.POLYGONSCAN_KEY); //we will eventually need to get an etherscan API key for this also, may be cumbersome with wallets with large numbers of transactions.

  const userTransactionHistory = await networkProvider.getHistory(userAddress);
  //console.log("history", currentHistory)

  //loop through transactions to pull out the ones to or from recurringPaymentContractAddress
  let transaction = -1;
  while (transaction < userTransactionHistory.length - 1) {
    transaction = transaction + 1;

    const filterTransactions = userTransactionHistory[transaction];
    if (
      filterTransactions.to == recurringPaymentsContractAddress ||
      filterTransactions.from == recurringPaymentsContractAddress
    ) {
      console.log(filterTransactions.hash);
    }
  }
  await timer(300000); // waits 5 min before repeating everything uint is in miliseconds
  init();
};

init();
