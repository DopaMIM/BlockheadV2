const { recurringPyamentsNewest4Abi } = require("./recurringPaymentsABI");

const { Contract, ethers } = require("ethers");
require("dotenv").config();

var recurringPaymentsContractAddress =
  "0xa5362cf8F89D6bae4c28B8a872545cA67C7aBF59";
// "0x5C6855C943d35130CE7180FAe3ee3E51c3b3D8A5"
//"0x32dF483898cDB30692C61BddEDbC24eAdcc5246B";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const init = async () => {
  const providers = [
    process.env.POLYGON_WSS,
    process.env.POLYGON_WSS3,
    process.env.POLYGON_WSS3,
    process.env.POLYGON_WSS,
  ];
  const randomProvider = Math.floor(Math.random() * providers.length);
  const provider = new ethers.providers.WebSocketProvider(
    providers[randomProvider]
  );
  console.log(provider.connection.url);

  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
  const signer = wallet.connect(provider);

  var recurringPaymentsContract = new ethers.Contract(
    recurringPaymentsContractAddress,
    recurringPyamentsNewest4Abi,
    signer
  );
  const listenForTransfer = recurringPaymentsContract.on(
    "PaymentTransferred",

    (index) => {
      console.log("Payment Transferred:");
      console.log(index.toString());
    }
  );

  const listenForNewPaymentProfile = recurringPaymentsContract.on(
    "RecurringPaymentCreated",
    (
      sender,
      recipient,
      amount,
      token,
      timeIntervalSeconds,
      paymentInterface,
      additionalInformation,
      paymentDue,
      canceled
    ) => {
      console.log("RecurringPaymentCreated event received:");
      console.log("sender:", sender);
      console.log("recipient:", recipient);
      console.log("amount:", amount.toString());
      console.log("Token:", token);
      console.log("timeIntervalSeconds:", timeIntervalSeconds.toString());
      console.log("paymentInterface:", paymentInterface);
      console.log("additionalInformation:", additionalInformation);
      console.log("paymentDue:", paymentDue.toString());
      console.log("cancelled:", canceled);
    }
  );

  const listenForPaymentCancelled = recurringPaymentsContract.on(
    "RecurringPaymentCancelled",

    (index, sender, recipient) => {
      console.log("Payment Cancelled:");
      console.log("index:", index.toString());
      console.log("sender:", sender);
      console.log("recipient:", recipient);
    }
  );
  provider._websocket.on("error", async () => {
    console.log(`Unable to connect to ${provider} retrying in 3s...`);
    //setTimeout(init, 3000);
    init();
  });
  provider._websocket.on("close", async (code) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );

    provider._websocket.terminate();
    init();
    //setTimeout(init, 3000);
  });
};
init();
