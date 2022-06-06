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

  // Now deposit the token
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  // But first, you have to approve the token. Else you will get an error
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
  console.log(`Depositing...`);
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log(`Deposited!`);
  const borrowData = await getBorrowUserData(lendingPool, deployer);
  const availableBorrowsETH = borrowData[0];
  const totalDebtETH = borrowData[1];
  // Get the DAI/ETH price
  const daiPrice = await getDaiPrice();
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
  const txResponse = await erc20Token.approve(spenderAddress, amountToSpend);
  await txResponse.wait(1);
  console.log(`Approved`);
}

async function getBorrowUserData(
  lendingPool: ILendingPool,
  account: Address
): Promise<[BigNumber, BigNumber]> {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);
  console.log(
    `You have ${ethers.utils.formatEther(
      totalCollateralETH
    )} worth of ETH deposited.`
  );
  console.log(
    `You have ${ethers.utils.formatEther(totalDebtETH)} worth of ETH borrowed.`
  );
  console.log(
    `You can borrow ${ethers.utils.formatEther(
      availableBorrowsETH
    )} worth of ETH.`
  );
  return [availableBorrowsETH, totalDebtETH];
}

async function getDaiPrice(): Promise<BigNumber> {
  const daiPriceFeed = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616e4d11a78f511299002da57a0a94577f1f4"
  );
  const price = (await daiPriceFeed.latestRoundData())[1];
  console.log(`The DAI/ETH price is ${price.toString()}`);
  return price;
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
