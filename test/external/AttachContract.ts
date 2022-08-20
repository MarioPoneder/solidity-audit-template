import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { use as chaiUse, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { artifacts, ethers, network, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";

import * as contracts from "../../src/types";

chaiUse(chaiAsPromised);

describe("Attach test contract to external contract", async function () {
  let signer: SignerWithAddress;

  let test: contracts.Test;
  // 1. change to type of external contract
  let targetContract: contracts.Greeter;

  before(async function () {
    // address of external contract must be provided via env. variable
    const contractAddress: string = <string>process.env.CONTRACT_ADDRESS;
    [signer] = await ethers.getSigners();

    const testArtifact: Artifact = await artifacts.readArtifact("Test");
    // deploy test contract and pass address of external contract
    test = <contracts.Test>await waffle.deployContract(signer, testArtifact, [contractAddress]);

    // 2. change to name of external contract
    targetContract = await ethers.getContractAt("Greeter", contractAddress, signer);
  });

  // 3. implement interactions with external and test contract
  it("Sample test case", async function () {
    await expect(test.connect(signer).sampleTestCase()).not.to.be.rejectedWith(Error);
  });
});
