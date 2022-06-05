/* eslint-disable no-process-exit */
import { ethers, getNamedAccounts, network } from "hardhat";
// import { getWeth, AMOUNT } from "../scripts/getWeth"
// import { networkConfig } from"../helper-hardhat-config"
// import { ILendingPool, ILendingPoolAddressesProvider } from "../typechain-types"
import { Address } from "hardhat-deploy/dist/types";
import { BigNumber } from "ethers";

async function main() {}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
