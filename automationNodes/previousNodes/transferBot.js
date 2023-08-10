//import required dependencies
const { gDAI } = require("./addresses");
var contractAddress = gDAI;

const {
  gasLimit,
  gasPriceMultiple,
  minimumVaultSize,
  wei,
  polygonTotalGas,
} = require("./settings");
const { recurringPaymentsABI } = require("./recurringPaymentsABI");

const { abi } = require("./abi");
const { Contract, ethers } = require("ethers");
require("dotenv").config();

const express = require("express");
const app = express();
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
PORT = randomNumber(50000, 60000);
const http = require("http");
//now we create the express server
const server = http.createServer(app);

const providers = [
  process.env.POLYGON_WSS,
  process.env.POLYGON_WSS2,
  process.env.POLYGON_WSS3,
  process.env.POLYGON_WSS4,
];
const randomProvider = Math.floor(Math.random() * providers.length);
const provider = new ethers.providers.WebSocketProvider(
  providers[randomProvider]
);
var recurringPaymentsContractAddress =
  "0xc3bA39840D7Fc18CFc43EbAC02CdaAe49AFdbC8c";
console.log(provider.connection.url);

const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
const signer = wallet.connect(provider);
var contract = new ethers.Contract(contractAddress, abi, signer);

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const init = async () => {





  //search each vault to detemine if it is near liquidation and contains a minimum balance to make it worthwhile

  var recurringPaymentsContract = new ethers.Contract(
    recurringPaymentsContractAddress,
    recurringPaymentsABI,
    signer
  );

  const totalPaymentsindex = await recurringPaymentsContract.totalPayments();
  console.log("totalPaymentsIndex",totalPaymentsindex.toString());

  let payments = -1;
  while (payments < totalPaymentsindex-1) {
    payments = payments + 1;

    const currentBlockTimeStamp =
      await recurringPaymentsContract.getCurrentBlockTimestamp();
console.log("currentBlockTimeStamp", currentBlockTimeStamp.toString())

console.log("payments", payments)
    let nextPaymentDue;
    try {
      nextPaymentDue = await recurringPaymentsContract.nextPaymentDue(payments);
    } catch (error) {
      console.log("Getting a sandwich...");
      await timer(5000);
      nextPaymentDue = await recurringPaymentsContract.nextPaymentDue(payments);
    }
console.log("nextPayment", nextPaymentDue.toString())
    if (nextPaymentDue < currentBlockTimeStamp) {

      /*  
      estimateGas = await provider.estimateGas(
        recurringPaymentsContract.transferFunds(payments)
      );
     */
    const estimateGas = 400000;
    
      const tx = {
        maxFeePerGas: await provider.getGasPrice()*2,
        maxPriorityFeePerGas: 50000000000,
        gasLimit: estimateGas,
        nonce: provider.getTransactionCount(wallet.address, "pending"),
      };

      //Liquidate eligible vault
      const transferFunds = await recurringPaymentsContract.transferFunds(
        payments,
        tx
      );
      console.log("submitting transfer", transferFunds)
      const receipt = await transferFunds.wait();

      if (receipt && receipt.blockNumber && receipt.status === 1) {
      
        // 0 - failed, 1 - success
        console.log(
          `Sell Transaction https://polygonscan.com/tx/${receipt.transactionHash} mined, status success`
        );
      } else if (receipt && receipt.blockNumber && receipt.status === 0) {
        console.log(
          `Sell Transaction https://polygonscan.com/tx/${receipt.transactionHash} mined, status failed`
        );
      } else {
        console.log(
          `Sell Transaction https://polygonscan.com/tx/${receipt.transactionHash} not mined`
        );
      }
    }
  }
  
  await timer (10000)
  init()
};
init();
