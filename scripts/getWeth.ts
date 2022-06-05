import { ethers, getNamedAccounts, network } from "hardhat";
// import { networkConfig } from "../helper-hardhat-config"

export async function getWeth() {
  const { deployer } = await getNamedAccounts();
  // call the deposit function on the WETH contract
  // you need the abi, contract address
}
