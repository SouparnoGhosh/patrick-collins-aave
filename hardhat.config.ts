import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";

import path from "path";
dotenv.config({ path: path.join(__dirname, "/.env.local") });

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.4.19",
      },
    ],
  },
  namedAccounts: { deployer: { default: 0 } },
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.MAINNET_URL || "",
      },
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
