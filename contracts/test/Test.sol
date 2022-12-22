// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

// 1. change to contract under test
import "../Greeter.sol";

contract Test {
    address public immutable targetAddress;

    constructor(address _targetAddress) {
        targetAddress = _targetAddress;
    }

    function stringEqual(string memory str1, string memory str2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    // 2. implement test cases
    function mainTestCase() external {
        Greeter target = Greeter(targetAddress);

        require(stringEqual(target.greet(), "Hello, world!"), "Unexpected greeting");

        target.setGreeting("Bonjour, le monde!");
        require(stringEqual(target.greet(), "Bonjour, le monde!"), "Greeting was not set");
    }
}
