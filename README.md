# Blockhead Automation Layer for Linea

The blockhead project contains two parts:

The Blockhead Automation Layer for Linea is a smart contract layer that enables Linea builders to automate simple functions within their contracts. Builders simply include the Blockhead Automation Layer implementation into their smart contracts and a decentralized network of nodes will mange the automation.

Blockhead Finance is a fully self-custody subscription payment dapp. It is the first proof-of-concept app fully automated by the Blockhead Automation Layer.#How to create a subscription payment with Blockhead Finance.

# Powered by Consensys

Bounty 1: To Infura and Beyond

Blockhead Automation Nodes rely heavily on infura WebSocket endpoints.  As their only function is to check every Automated function every 60 seconds to determine parameters have been met to call that function, and if true, call that function. The node Infura websocket implementation are all in the automationNodes folder. 

Linea Websocket Endpoint -> lineaAutomationNode.jsLinea Goerli Websocket Endpoint  - > lineaGoerliAutomationNode.js & testNode.js

Polygon Websocket Endpoint  ->  polygonAutomationNode.js

Sepolia Websocket Endpoint -> sepoliaAutomationNode.js

The Blockhead Finance dapp utilized the RPC endpoints for each chain the dapp is deployed.

The actual Endpoint URLs are stored locally in a .env file and are not shared for security reasons

Bounty 3: IYKYK Linea Addition

Both the blockhead Automation Layer and Blockhead Finance recurring Payments are live on Linea

Recurring Payments contract: https://explorer.linea.build/address/0x06A4A92EE08d44769fa67e85571a6C9a5A0299CA

Automation Layer Contract: https://explorer.linea.build/address/0xCa9A5C76e9c792c9106C9c1376521bAE52244790

Node Sequencer Contract: https://explorer.linea.build/address/0x08399e90178e2E51e160394123C8301E27AFBe92

Batch Processor Contract: https://explorer.linea.build/address/0x21bCd9863988EE6EE23EaF765b9E66bfA7D356F6

Duh Contract: https://explorer.linea.build/address/0x5cb892fc4b6b99F6B11882A504a3b20fA6252e3B

Bounty 5: Make a Dapp tha Slaps, No Cap

It most definitely slaps

# How to create a subscription payment with Blockhead Finance

Merchants can set up subscription payments by visiting https://app.Blockhead.Finance.

1. Set up a Blockhead Finance merchant account by registering withemail.

2. Create a new subscription product using the create subscription form.

3. Copy the URL of your subscription and implement it into your website checkout, by linking the subscribe button for the product or service to the URL of your subscription page.

4. Monitor your subscriptions on your merchant dashboard.

Customer at checkout at (your landing page URL)1. Connect Wallet

2. Approve Token spend3. Approve recurring payment

4. Enjoy your product without ever giving custody of their tokens to a third party or paying another gas fee, while we automagically transfer the approved tokens at the approved intervals.

#How to run the Blockhead Finance app locally
1. cd into the blockhead-finance-app folder
2. install pnmp globally
"""
$ npm i pnpm -g
"""
3. Install dependencies
"""
$pnpm i
"""
4. create a .env in the app folder and add supabase url and keys

"""
NEXT_PUBLIC_SUPABASE_URL="https://some.supabase.co/"
NEXT_PUBLIC_SUPABASE_ANON_KEY= "your supabase key here"
"""
Email Jason if you need our supabase key

5. Run dev server
"pnpm dev"

6. When running locally the create user email redirect will not work, so sign in with the dummy credentials:

email: test@test.com
password: blockhead123 


# How to run the Blockhead Finance app locally

# How to run a Blockhead Automation Node (testNode):

1.  cd into the automationNodes folder and install ethers 5.6.1

$npm install ethers@5.6.1 --save

2. Install dot env if not already installed

$npm install dotenv -g

3. Update your .env file with your Infura WebSocket provider endpoints for the network you wish to automate as well as the private key. 

LINEAGOERLI_WSS = “your Infura WebSocket endpoint URL”

TEST_ACCOUNT = “Your nodes wallet private key”

4.  Install pm2

$ npm install pm2 -g

5.  Install pm2

$ npm install pm2 -g

4. Make sure your wallet has sufficient LineaGoerliETH for submitting transactions, then start the node $pm2 start automationNodes/testNode.js

# How to automate a contract with the Blockhead Automation Layer:

https://docs.google.com/document/d/1vCk6s6jOHp6z3VvmnEzn8L8Bz0apo5aVvXI42nkWrp0/edit?usp=sharing

Polygon Addresses

sequencer: 0x702A1Fe16B6ff595E9E2AaAfa1e8e760Df88588C

AutomationLayer: 0x62f43fb9832e83cde2380327fad8d46e77ad0bc8

DUH: 0xA4dABAa2DeDC043433A598e4cB1810842714A7d5

PaymentLayer: 0x888A74ad7076Fae93147DC1e01146Ae9381e5B36

batchProcessor: 0x42c6AA0e41Ded8cfcdF260bc3155f26d00FafC20

sepolia testnet addresses

sequencer: 0xa3417E64A0749073183E948d3d1b17317230Bc87

AutomationLayer: 0x57216Cb79FA0B948d48d28Fb374Af3ca718E5705

PaymentLayer: 0x350288deCD61DDf2D05954074475536cdA0d4405 

Duh : 0xe981768F7eBeC7001c21DAC72C1BD986c1522580

batchProcessor: 0x4a254804dc93f65453d21f8a4AbE7E52A4320782

Linea Testnet Addresses

sequencer: 0x06A4A92EE08d44769fa67e85571a6C9a5A0299CA 

AutomationLayer: 0x346a834dFEeFc165C0307dbA320812Afea650a5C

PaymentLayer: 0x27D15b36507cAF395D7Bb5607A0974c1dbE85c0e

Duh : 0x5cb892fc4b6b99F6B11882A504a3b20fA6252e3B

batchProcessor: none

Linea Mainnet addresses

sequencer:  0x08399e90178e2E51e160394123C8301E27AFBe92

AutomationLayer: 0xCa9A5C76e9c792c9106C9c1376521bAE52244790

PaymentLayer: 0x06a4a92ee08d44769fa67e85571a6c9a5a0299ca

Duh : 0x5cb892fc4b6b99F6B11882A504a3b20fA6252e3B

batchProcessor: 0x21bCd9863988EE6EE23EaF765b9E66bfA7D356F6
