import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { use as chaiUse, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";

// 1. change to types of external contract
import type { Greeter } from "../../src/types/contracts/Greeter";
import type { Test } from "../../src/types/contracts/test/Test";

chaiUse(chaiAsPromised);

describe("Attach test contract to external contract", async function () {
  let signer: SignerWithAddress;

  let test: Test;
  // 2. change to type of external contract
  let contract: Greeter;

  before(async function () {
    // address of external contract must be provided via env. variable
    const contractAddress: string = <string>process.env.CONTRACT_ADDRESS;
    [signer] = await ethers.getSigners();

    const testArtifact: Artifact = await artifacts.readArtifact("Test");
    // deploy test contract and pass address of external contract
    test = <Test>await waffle.deployContract(signer, testArtifact, [contractAddress]);

    // 3. change to name of external contract
    const contractFactory = await ethers.getContractFactory("Greeter", signer);
    contract = contractFactory.attach(contractAddress);
  });

  // 4. implement interactions with external and test contract
  it("Sample test case", async function () {
    await expect(test.connect(signer).sampleTestCase()).not.to.be.rejectedWith(Error);
  });
});
