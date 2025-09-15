//import required dependencies
const { automationLayerABI, sequencerABI } = require("./ABIs");



const { Contract, ethers } = require("ethers");
require("dotenv").config();


const providers = [
  process.env.ARBITRUM_WSS
];
console.log(providers)
const randomProvider = Math.floor(Math.random() * providers.length);
const provider = new ethers.providers.WebSocketProvider(
  providers[randomProvider]
);
const automationLayerContractAddress = "0x1Bb81875e6133a4791a8FaB68aF6e455de9E1B04" //"0x62f43fb9832e83cde2380327fad8d46e77ad0bc8"

const sequencerAddress = "0x60375d0aDA5225845fcC12945F8Fd86144E6F413" // "0x702A1Fe16B6ff595E9E2AaAfa1e8e760Df88588C";
console.log(provider.connection.url);

const wallet = new ethers.Wallet(process.env.TEST_ACCOUNT);
const signer = wallet.connect(provider);
//var contract = new ethers.Contract(contractAddress, abi, signer);

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const init = async () => {
  //search each vault to detemine if it is near liquidation and contains a minimum balance to make it worthwhile

  var automationLayerContract = new ethers.Contract(
    automationLayerContractAddress,
    automationLayerABI,
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
    const maxFeePerGas = await provider.getGasPrice()
          

          const tx = {
            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: maxFeePerGas,
            gasLimit: estimateGas,
            nonce: await provider.getTransactionCount(wallet.address, "pending"),
          };

          //Liquidate eligible vault
          const simpleAutomation = await automationLayerContract.simpleAutomation(account, tx);
          console.log("simpleAutomation", simpleAutomation);
          const receipt = await simpleAutomation.wait();

          if (receipt && receipt.blockNumber && receipt.status === 1) {
            // 0 - failed, 1 - success
            console.log(
              `Transaction https://explorer.optimism.io/tx/${receipt.transactionHash} mined, status success`
            );
          } else if (receipt && receipt.blockNumber && receipt.status === 0) {
            console.log(
              `Transaction https://explorer.optimism.io/tx/${receipt.transactionHash}} mined, status failed`
            );
          } else {
            console.log(
              `Transaction https://explorer.optimism.io/tx/${receipt.transactionHash}} not mined`
            );
          }
        }
      }
    }
  }
  } else {
    console.log("Not Current Node");
  }
  await timer(300000);
  init();
};
init();
