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

  // optional
  //let targetContract: contracts.Greeter;

  before(async function () {
    // address of external contract must be provided via env. variable
    const contractAddress: string = <string>process.env.CONTRACT_ADDRESS;
    const impersonateAddress: string = <string>process.env.IMPERSONATE_ADDRESS;

    [signer] = await ethers.getSigners();

    const testArtifact: Artifact = await artifacts.readArtifact("Test");
    // deploy test contract and pass address of external contract
    test = <contracts.Test>await waffle.deployContract(signer, testArtifact, [contractAddress]);

    if (impersonateAddress) {
      // get deployed code of Test contract and "deploy" it at 'impersonateAddress'
      const deployedCode = await ethers.provider.getCode(test.address);
      await network.provider.request({ method: "hardhat_setCode", params: [impersonateAddress, deployedCode] });
      test = await ethers.getContractAt("Test", impersonateAddress, signer);
    }

    // optional
    //targetContract = await ethers.getContractAt("Greeter", contractAddress, signer);
  });

  // optional: implement additional interactions with external and test contract
  it("Main test case", async function () {
    await expect(test.connect(signer).mainTestCase()).not.to.be.rejectedWith(Error);
  });
});
