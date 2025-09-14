import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const PK = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: { version: "0.8.28", settings: { optimizer: { enabled: true, runs: 200 } } },
  networks: {
    hardhat: {},
    sepolia:  { url: process.env.SEPOLIA_RPC_URL  || "", accounts: PK },
    polygon:  { url: process.env.POLYGON_RPC_URL  || "", accounts: PK },
    linea:    { url: process.env.LINEA_RPC_URL    || "", accounts: PK },
    base:     { url: process.env.BASE_RPC_URL     || "", accounts: PK },
    optimism: { url: process.env.OPTIMISM_RPC_URL || "", accounts: PK },
  },
};
export default config;
