// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

// 1. change to contract under test
import "../Greeter.sol";

contract Test {
    // 2. change type
    Greeter immutable target;

    constructor(address _contractAddress) {
        // 3. change type
        target = Greeter(_contractAddress);
    }

    function stringEqual(string memory str1, string memory str2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    // 4. implement test cases
    function sampleTestCase() external {
        require(stringEqual(target.greet(), "Hello, world!"), "Unexpected greeting");

        target.setGreeting("Bonjour, le monde!");
        require(stringEqual(target.greet(), "Bonjour, le monde!"), "Greeting was not set");
    }
}
