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
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
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

async function approveErc20(
  erc20ContractAddress: string,
  spenderAddress: string,
  amountToSpend: string,
  account: Address
) {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    erc20ContractAddress,
    account
  );
  const txResponse = erc20Token.approve(spenderAddress, amountToSpend);
  await txResponse.wait(1);
  console.log(`Approved`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
