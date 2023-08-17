const ethers = require('ethers');
require("dotenv").config();

// Replace with your contract ABI
const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "cancelRecurringPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_timeIntervalSeconds",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_interface",
				"type": "address"
			},
			{
				"internalType": "bytes[]",
				"name": "_data",
				"type": "bytes[]"
			},
			{
				"internalType": "bool",
				"name": "_freeTrial",
				"type": "bool"
			}
		],
		"name": "createRecurringPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "RecurringPaymentCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeIntervalSeconds",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "paymentInterface",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes[]",
				"name": "data",
				"type": "bytes[]"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "paymentDue",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "canceled",
				"type": "bool"
			}
		],
		"name": "RecurringPaymentCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "setDuhAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "transferFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_minimumDuh",
				"type": "uint256"
			}
		],
		"name": "updateMinimumDuh",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "duh",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentBlockTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPaymentDue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "isPaymentCanceled",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "minimumDuh",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "recurringPayments",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timeIntervalSeconds",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "paymentInterface",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "paymentDue",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "canceled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPayments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
  // ... (contract ABI here)
;

// Replace with your provider (e.g., Infura or Alchemy)
const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC2);
//console.log(provider)
// Replace with your contract address
const contractAddress = "0x32dF483898cDB30692C61BddEDbC24eAdcc5246B";

// Replace with the user's address you want to search for
const userAddress = '0xeA9B8D8aD9668D0FdedE95333E816c36F2210fc0';

// Create the contract instance
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

// Define the event filter
const eventFilter = contract.filters.RecurringPaymentCreated(null, userAddress);

// Function to decode the event data
function decodeEventData(event, contract) {
  const decodedData = contract.interface.decodeEventLog(event.event, event.data);
  return decodedData;
}

// Function to retrieve all events for a specific address
async function getEventsForAddress(address) {
  const events = await contract.queryFilter(eventFilter);

  const decodedEvents = events.map(event => {
    return {
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      eventData: decodeEventData(event, contract)
    };
  });

  return decodedEvents;
}

// Retrieve all events for the user's address
getEventsForAddress(userAddress)
  .then(events => {
    events.forEach(event => {
      const eventData = event.eventData;
      const index = eventData.index;
      console.log('Index:', index);
      console.log('Transaction Hash:', event.transactionHash);
      console.log('Block Number:', event.blockNumber);
      console.log('Event Data:', eventData);
      console.log('----------------------------------------');
    });
  })
  .catch(error => {
    console.error('Error retrieving events:', error);
  });
