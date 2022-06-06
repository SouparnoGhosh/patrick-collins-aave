import { ethers, getNamedAccounts /* network */ } from "hardhat";
// import { networkConfig } from "../helper-hardhat-config";
import { BigNumber } from "ethers";

export const AMOUNT = ethers.utils.parseEther("0.02").toString();

export async function getWeth() {
  const { deployer } = await getNamedAccounts();
  // call the deposit function on the WETH contract
  // you need the abi, contract address
  //   const chainId = network.config.chainId as number;
  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    deployer
  );
  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance: BigNumber = await iWeth.balanceOf(deployer);
  console.log(`Got ${ethers.utils.formatEther(wethBalance)} WETH`);
}
