import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers, network } from "hardhat";

const ERC20_InterfaceSubset = [
  "function decimals() external view returns (uint8)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string memory)",
];

// get signer for given account address
export async function impersonate(account: string): Promise<SignerWithAddress> {
  await network.provider.request({ method: "hardhat_impersonateAccount", params: [account] });
  return ethers.getSigner(account);
}

// get account balance in ETH (not wei)
export async function getBalance_ETH(account: string): Promise<string> {
  const balance_wei = await ethers.provider.getBalance(account);
  return ethers.utils.formatEther(balance_wei);
}
export async function printBalance_ETH(account: string): Promise<void> {
  console.log("Balance of", account, "|", "ETH", ":", await getBalance_ETH(account));
}

// add ETH amount to account balance
export async function addBalance_ETH(account: string, amount_eth: number): Promise<void> {
  const balance_wei = await ethers.provider.getBalance(account);
  const amount_wei = ethers.utils.parseEther(amount_eth.toString());
  const newHexBalance = balance_wei.add(amount_wei).toHexString().replace("0x0", "0x"); // without leading zeros
  await network.provider.request({ method: "hardhat_setBalance", params: [account, newHexBalance] });
}

// get ERC20 account balance in token units (not base units)
export async function getBalance_ERC20(token: string, account: string): Promise<string> {
  const [signer] = await ethers.getSigners();
  const tokenContract = new ethers.Contract(token, ERC20_InterfaceSubset, signer);
  const tokenDecimals = await tokenContract.decimals();
  const balance_baseunits = await tokenContract.balanceOf(account);
  return ethers.utils.formatUnits(balance_baseunits, tokenDecimals);
}
export async function printBalance_ERC20(token: string, account: string): Promise<void> {
  const [signer] = await ethers.getSigners();
  const tokenContract = new ethers.Contract(token, ERC20_InterfaceSubset, signer);
  console.log("Balance of", account, "|", await tokenContract.symbol(), ":", await getBalance_ERC20(token, account));
}

// send token amount in token units (not base units) from arbitrary account (will be impersonated) to given account
export async function sendToken_ERC20(token: string, from: string, to: string, amount_units: number): Promise<void> {
  const signer = await impersonate(from); // impersonate 'from' address
  await addBalance_ETH(from, 0.1); // fund 'from' address to pay for token transfer

  const tokenContract = new ethers.Contract(token, ERC20_InterfaceSubset, signer);

  const tokenDecimals = await tokenContract.decimals();
  const amount_baseunits = ethers.utils.parseUnits(amount_units.toString(), tokenDecimals);

  await tokenContract.transfer(to, amount_baseunits);
}
