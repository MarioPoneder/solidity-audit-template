import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { use as chaiUse, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers, network } from "hardhat";

import * as contracts from "../../src/types";
import { addBalance_ETH, printBalance_ERC20, printBalance_ETH, sendToken_ERC20 } from "./helper";

chaiUse(chaiAsPromised);

describe("Attach test contract to external contract", async function () {
  let signer: SignerWithAddress;

  let test: contracts.Test;

  // optional: use external contract in test case
  //let targetContract: contracts.Greeter;

  before(async function () {
    // address of external contract must be provided via env. variable
    const contractAddress: string = <string>process.env.CONTRACT_ADDRESS;
    const impersonateAddress: string = <string>process.env.IMPERSONATE_ADDRESS;

    [signer] = await ethers.getSigners();

    // deploy test contract and pass address of external contract
    const testFactory: contracts.Test__factory = <contracts.Test__factory>await ethers.getContractFactory("Test");
    test = <contracts.Test>await testFactory.connect(signer).deploy(contractAddress);
    await test.deployed();

    if (impersonateAddress) {
      // get deployed code of Test contract and "deploy" it at 'impersonateAddress'
      const deployedCode = await ethers.provider.getCode(test.address);
      await network.provider.request({ method: "hardhat_setCode", params: [impersonateAddress, deployedCode] });
      test = await ethers.getContractAt("Test", impersonateAddress, signer);
    }

    /*
    // optional: prepare ETH and ERC20 balances
    const contractWETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const holderWETH = "0xf04a5cc80b1e94c69b48f5ee68a08cd2f09a7c3e";
    await addBalance_ETH(test.address, 1);
    await sendToken_ERC20(contractWETH, holderWETH, test.address, 2.5);
    await printBalance_ETH(test.address);
    await printBalance_ERC20(contractWETH, test.address);
    */

    // optional: use external contract in test case
    //targetContract = await ethers.getContractAt("Greeter", contractAddress, signer);
  });

  // optional: implement additional interactions with external and test contract
  it("Main test case", async function () {
    await expect(test.connect(signer).mainTestCase()).not.to.be.rejectedWith(Error);
  });
});
