import { task } from "hardhat/config";

task("storage-layout", "Export the contracts' storage layouts", async (_taskArgs, hre) => {
  await hre.storageLayout.export();
});
