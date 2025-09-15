const hre = require("hardhat");

// usage examples:
// npx hardhat run scripts/deploy.js --network polygon --contract AutomationLayer
// npx hardhat run scripts/deploy.js --network linea --contract PaymentLayer --args '["0xUSDC","0xAutomation","0xSequencer"]'

async function main() {
  const { ethers, network } = hre;

  // ---- read CLI flags ----
  const argv = require("minimist")(process.argv.slice(2));
  const name = argv.contract;
  const args = argv.args ? JSON.parse(argv.args) : [];

  if (!name) {
    throw new Error('Missing --contract <ContractName>. Example: --contract AutomationLayer');
  }

  console.log(`\nNetwork: ${network.name}`);
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  // ---- deploy ----
  const Factory = await ethers.getContractFactory(name);
  console.log(`Deploying ${name} with args:`, args);
  const contract = await Factory.deploy(...args);
  const receipt = await contract.deploymentTransaction().wait();
  console.log(`${name} deployed at: ${contract.target}`);
  console.log(`Tx: ${receipt.hash}`);

  // ---- (optional) write a local deployments file ----
  const fs = require("fs");
  const path = require("path");
  const file = path.join(__dirname, "..", "deployments.json");
  let current = {};
  if (fs.existsSync(file)) {
    current = JSON.parse(fs.readFileSync(file, "utf8"));
  }
  current[network.name] = current[network.name] || {};
  current[network.name][name] = contract.target;
  fs.writeFileSync(file, JSON.stringify(current, null, 2));
  console.log(`Saved to deployments.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
