import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";

// 1. change to types of external contract
import type { Greeter } from "../../src/types/contracts/Greeter";

describe("Attach to external contract", async function () {
  let signer: SignerWithAddress;

  // 2. change to  type of external contract
  let contract: Greeter;

  before(async function () {
    // address of external contract must be provided via env. variable
    const contractAddress: string = <string>process.env.CONTRACT_ADDRESS;
    [signer] = await ethers.getSigners();

    // 3. change to name of external contract
    const contractFactory = await ethers.getContractFactory("Greeter", this.signer);
    contract = contractFactory.attach(contractAddress);
  });

  // 4. implement interactions with external contract
  it("Sample test case", async function () {
    expect(await contract.connect(signer).greet()).to.equal("Hello, world!");

    await contract.setGreeting("Bonjour, le monde!");
    expect(await contract.connect(signer).greet()).to.equal("Bonjour, le monde!");
  });
});
