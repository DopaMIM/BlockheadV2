//import required dependencies

const { automationLayerABI2, sequencerABI } = require("./AutomationLayer");

const { nodeSequencerABI } = require("./sequencer");

const { Contract, ethers } = require("ethers");
require("dotenv").config();

const providers = [
  process.env.SEPOLIA_WSS
];
const randomProvider = Math.floor(Math.random() * providers.length);
const provider = new ethers.providers.WebSocketProvider(
  providers[randomProvider]
);
const automationLayerContractAddress = "0x57216Cb79FA0B948d48d28Fb374Af3ca718E5705"
  //"0xe8a12A7b1d803E2285d65Db1c3443CCC42ead896";
const sequencerAddress = "0xa3417E64A0749073183E948d3d1b17317230Bc87";
console.log(provider.connection.url);

const wallet = new ethers.Wallet(process.env.TEST_ACCOUNT);
const signer = wallet.connect(provider);
//var contract = new ethers.Contract(contractAddress, abi, signer);

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const init = async () => {
  //search each vault to detemine if it is near liquidation and contains a minimum balance to make it worthwhile

  var automationLayerContract = new ethers.Contract(
    automationLayerContractAddress,
    automationLayerABI2,
    signer
  );

  const sequencerContract = new ethers.Contract(
    sequencerAddress,
    sequencerABI,
    signer
  );

  const totalAccountsindex = await automationLayerContract.totalAccounts();
  console.log("totalAccountsindex", totalAccountsindex.toString());

  const getCurrentNode = await sequencerContract.getCurrentNode();
  console.log(getCurrentNode);
  console.log(wallet.address);

  if (getCurrentNode == wallet.address) {
    let account = -1;
    while (account < totalAccountsindex - 1) {
      account = account + 1;

      console.log("account", account);
      let checkSimpleAutomation;
      try {
        checkSimpleAutomation = await automationLayerContract.checkSimpleAutomation(account);
      } catch (error) {
        console.log("cannot checkSimpleAutomation", account);
        checkSimpleAutomation = false;
      }
      console.log("checkSimpleAutomation", checkSimpleAutomation);
      if (checkSimpleAutomation == true) {
        let isCanceled = await automationLayerContract.isAccountCanceled(
          account
        );

        if (isCanceled == false) {
          let estimateGas;
          try {
            estimateGas = await
              automationLayerContract.estimateGas.simpleAutomation(account)
            ;
          } catch (error) {
            estimateGas == 0;
            console.log("simpleAutomation Fails", account);
          }
  if (estimateGas > 0){
    const maxFeePerGas = (await provider.getGasPrice()) * 2
          

          const tx = {
            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: maxFeePerGas,
            gasLimit: estimateGas *2,
            nonce: await provider.getTransactionCount(wallet.address, "pending"),
          };

          //Liquidate eligible vault
          const simpleAutomation = await automationLayerContract.simpleAutomation(account, tx);
          console.log("simpleAutomation", simpleAutomation);
          const receipt = await simpleAutomation.wait();

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
    }
  }
  } else {
    console.log("Not Current Node");
  }
  await timer(60000);
  init();
};
init();
