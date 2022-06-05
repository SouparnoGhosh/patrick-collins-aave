/* eslint-disable node/no-missing-import */
/* eslint-disable no-process-exit */
import { ethers, getNamedAccounts, network } from "hardhat";
import { getWeth, AMOUNT } from "../scripts/getWeth";
// import { networkConfig } from"../helper-hardhat-config"
import {
  ILendingPool,
  ILendingPoolAddressesProvider,
  // @ts-ignore
} from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { BigNumber } from "ethers";

async function main() {
  await getWeth();
  const { deployer } = await getNamedAccounts();

  // we need the abi and address
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending Pool address: ${lendingPool.address}`);

  // Now deposit
  19:53
}

async function getLendingPool(account: Address): Promise<ILendingPool> {
  const lendingPoolAddressesProvider: ILendingPoolAddressesProvider =
    await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
      account
    );
  const lendingPoolAddress =
    await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool: ILendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  return lendingPool;
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
