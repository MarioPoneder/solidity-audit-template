import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import * as contracts from "../../src/types";

describe("Attach to external contract", async function () {
  let signer: SignerWithAddress;

  // 1. change to type of external contract
  let targetContract: contracts.Greeter;

  before(async function () {
    // address of external contract must be provided via env. variable
    const contractAddress: string = <string>process.env.CONTRACT_ADDRESS;
    [signer] = await ethers.getSigners();

    // 2. change to name of external contract
    targetContract = await ethers.getContractAt("Greeter", contractAddress, signer);
  });

  // 3. implement interactions with external contract
  it("Sample test case", async function () {
    expect(await targetContract.connect(signer).greet()).to.equal("Hello, world!");

    await targetContract.setGreeting("Bonjour, le monde!");
    expect(await targetContract.connect(signer).greet()).to.equal("Bonjour, le monde!");
  });
});
