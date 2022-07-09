# Solidity Template

My favorite setup for writing Solidity smart contracts.

- [Hardhat](https://github.com/nomiclabs/hardhat): compile and run the smart contracts on a local development network
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript types for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Waffle](https://github.com/EthWorks/Waffle): tooling for writing comprehensive smart contract tests
- [Solhint](https://github.com/protofire/solhint): linter
- [Solcover](https://github.com/sc-forks/solidity-coverage): code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter
- [Tracer](https://github.com/zemse/hardhat-tracer): trace events, calls and storage operations
- [Storage Layout](https://github.com/aurora-is-near/hardhat-storage-layout): generate smart contract storage layout
- Fork the mainnet as a Hardhat Network instance
- Download external contracts and their dependencies (via Python script)
- Attach tests to external contracts (in mainnet fork)

This is a GitHub template, which means you can reuse it as many times as you want. You can do that by clicking the "Use this
template" button at the top of the page.

## Usage

### Pre Requisites

Before running any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. Follow the example in `.env.example`. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
$ yarn install
$ pip install -r contract-downloader/requirements.txt  # for Python contract downloader
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha test for the example Greeter contract:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true
$ yarn test
```

### Tracer

Shows events, calls and storage operations when running the tests:

```sh
$ yarn test --trace      # shows logs + calls
$ yarn test --fulltrace  # shows logs + calls + sloads + sstores
```

### Storage Layout

Shows the compiled contracts' storage layouts:

```sh
$ yarn storage
```

### Mainnet Fork

Starts an instance of Hardhat Network that forks mainnet. This means that it will simulate having the same state as mainnet, but it will work as a local development network. That way you can interact with deployed protocols and test complex interactions locally.

To use this feature you need to set your Alchemy mainnet API key in the `.env` file.

```sh
$ yarn fork
$ yarn fork --fork-block-number <num>  # pin the block number
```

### Clone (with Python contract downloader)

Downloads a verified smart contract and its dependencies from Etherscan, etc.
To use this feature you need to set the relevant API keys in the `.env` file.

```sh
$ yarn clone <contract address>
$ yarn clone <contract address> --network <chain>  # e.g. polygon
```

In order to remove a previously downloaded smart contract and its dependencies from the local filesystem, run:

```sh
$ yarn clone <contract address> --remove
```

### Attach test to external contract

Attaches the Mocha test `external/Attach` to a deployed contract in your local Hardhat Network (e.g. mainnet fork).
The test contains sample code for the Greeter contract and therefore needs to be adapted according to your needs.

```sh
$ yarn attach <contract address>
```

Features like [Report Gas](#report-gas) and [Tracer](#tracer) can also be used with this test.

### Attach test contract to external contract

Attaches the Mocha test `external/AttachContract` and the contract `test/Test` to a deployed contract in your local Hardhat Network (e.g. mainnet fork).
The test contains sample code for the Greeter contract and therefore needs to be adapted according to your needs.

```sh
$ yarn attachContract <contract address>
```

Features like [Report Gas](#report-gas) and [Tracer](#tracer) can also be used with this test.

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the example Greeter contract to the Hardhat Network:

```sh
$ yarn deploy --greeting "Hello, world!"
```

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the [hardhat-vscode](https://github.com/NomicFoundation/hardhat-vscode) extension.

## Caveats

### Ethers and Waffle

If you can't get the [Waffle matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html) to work, try to
make your `ethers` package version match the version used by the `@ethereum-waffle/chai` package. Seem
[#111](https://github.com/paulrberg/solidity-template/issues/111) for more details.
