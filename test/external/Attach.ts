import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";

import * as contracts from "../../src/types";
import { addBalance_ETH, impersonate, printBalance_ERC20, printBalance_ETH, sendToken_ERC20 } from "./helper";

describe("Attach to external contract", async function () {
  let signer: SignerWithAddress;

  // 1. change to type of external contract
  let targetContract: contracts.Greeter;

  before(async function () {
    // address of external contract must be provided via env. variable
    const contractAddress: string = <string>process.env.CONTRACT_ADDRESS;
    const impersonateAddress: string = <string>process.env.IMPERSONATE_ADDRESS;

    if (impersonateAddress) {
      signer = await impersonate(impersonateAddress);
    } else {
      [signer] = await ethers.getSigners();
    }

    /*
    // optional: prepare ETH and ERC20 balances
    const contractWETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const holderWETH = "0xf04a5cc80b1e94c69b48f5ee68a08cd2f09a7c3e";
    await addBalance_ETH(signer.address, 1);
    await sendToken_ERC20(contractWETH, holderWETH, signer.address, 2.5);
    await printBalance_ETH(signer.address);
    await printBalance_ERC20(contractWETH, signer.address);
    */

    // 2. change to name of external contract
    targetContract = await ethers.getContractAt("Greeter", contractAddress, signer);
  });

  // 3. implement interactions with external contract
  it("Main test case", async function () {
    expect(await targetContract.connect(signer).greet()).to.equal("Hello, world!");

    await targetContract.setGreeting("Bonjour, le monde!");
    expect(await targetContract.connect(signer).greet()).to.equal("Bonjour, le monde!");
  });
});
