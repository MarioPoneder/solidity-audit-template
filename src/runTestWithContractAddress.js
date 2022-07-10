const { execSync } = require("child_process");
const { exit } = require("process");

// validate command line
if (process.argv.length < 3) {
  // from console?
  console.log("Usage: node runTestWithContractAddress <hardhat test> <contract address>");
  exit(1);
}
if (process.argv.length < 4) {
  // from yarn?
  console.log("Usage: yarn attach <contract address>");
  exit(1);
}

// get positional args
const testFile = process.argv[2];
const contractAddress = process.argv[3];
let otherArgs = "";
for (i = 4; i < process.argv.length; ++i) {
  otherArgs += " " + process.argv[i];
}

try {
  execSync(
    "npx cross-env CONTRACT_ADDRESS=" +
      contractAddress +
      " hardhat test " +
      testFile +
      otherArgs +
      " --network localhost",
    { stdio: "inherit" },
  );
} catch (ex) {
  // ignore when test fails, error output is given by 'hardhat test' anyways
}
