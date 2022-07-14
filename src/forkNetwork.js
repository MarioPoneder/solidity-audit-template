const { execSync } = require("child_process");
const { exit } = require("process");

// validate command line
if (process.argv.length < 4 || process.argv[2] != "--network") {
  console.log("Usage: node forkNetwork --network <name>");
  console.log("Usage: yarn fork --network <name>");
  exit(1);
}

// get positional args
const networkName = process.argv[3];
let otherArgs = "";
for (i = 4; i < process.argv.length; ++i) {
  otherArgs += " " + process.argv[i];
}

try {
  execSync("npx cross-env NETWORK_NAME=" + networkName + " hardhat node" + otherArgs, { stdio: "inherit" });
} catch (ex) {
  // ignore when test fails, error output is given by 'hardhat test' anyways
}
