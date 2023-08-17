//import required dependencies

const { automationLayerABI, sequencerABI, duhABI } = require("./ABIs");



const { Contract, ethers } = require("ethers");
require("dotenv").config();

const providers = [
  process.env.LINEAGOERLI_WSS
];
const randomProvider = Math.floor(Math.random() * providers.length);
const provider = new ethers.providers.WebSocketProvider(
  providers[randomProvider]
);
const automationLayerContractAddress = "0x346a834dFEeFc165C0307dbA320812Afea650a5C"

const sequencerAddress = "0x06A4A92EE08d44769fa67e85571a6C9a5A0299CA";

duhAddress = "0x5cb892fc4b6b99F6B11882A504a3b20fA6252e3B"
console.log(provider.connection.url);

const wallet = new ethers.Wallet(process.env.TEST_ACCOUNT);
const signer = wallet.connect(provider);
//var contract = new ethers.Contract(contractAddress, abi, signer);

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const automate = async () => {
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
              `Transaction https://explorer.goerli.linea.build/tx/${receipt.transactionHash} mined, status success`
            );
          } else if (receipt && receipt.blockNumber && receipt.status === 0) {
            console.log(
              `Transaction https://explorer.goerli.linea.build/tx/${receipt.transactionHash} mined, status failed`
            );
          } else {
            console.log(
              `Transaction https://explorer.goerli.linea.build/tx/${receipt.transactionHash} not mined`
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
  automate();
};
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
    const duhContract = new ethers.Contract(duhAddress, duhABI, signer)

    const isNoderegistered = await sequencerContract.isNodeRegistered(wallet.address)
    console.log(isNoderegistered)
    if (isNoderegistered == true){automate()}
    else { const hasSufficientTokens = await sequencerContract.hasSufficientTokens()
    console.log(hasSufficientTokens)
    if (hasSufficientTokens == true){const registerNode = await sequencerContract.registerNode()
        const receipt = await registerNode.wait()
    console.log(receipt)

        const isNoderegistered = await sequencerContract.isNodeRegistered(wallet.address)
    console.log("is node registered ==", isNoderegistered)
init()}
else{"You do not have enough DUH tokens to operate a node"}
 
}
}

init();
