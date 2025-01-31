# Solidity Coding, Testing and Audit Template [![Open in Gitpod][gitpod-badge]][gitpod] [![Hardhat][hardhat-badge]][hardhat] [![License: MIT][license-badge]][license]

[gitpod]: https://gitpod.io/#https://github.com/MarioPoneder/solidity-audit-template
[gitpod-badge]: https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-FFB45B?logo=gitpod
[hardhat]: https://hardhat.org/
[hardhat-badge]: https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

My favorite setup for writing Solidity smart contracts as well as auditing/testing external contracts.

- [Hardhat](https://github.com/nomiclabs/hardhat): compile, run and test smart contracts on a local development network
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript bindings for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Solhint](https://github.com/protofire/solhint): code linter
- [Solcover](https://github.com/sc-forks/solidity-coverage): code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter
- [Tracer](https://github.com/zemse/hardhat-tracer): trace events, calls and storage operations
- [Storage Layout](https://github.com/aurora-is-near/hardhat-storage-layout): generate smart contract storage layout
- Fork the mainnet or another EVM based network as a Hardhat Network instance
- Download external contracts and their dependencies (via Python script)
- Gather contracts in scope from Immuenfi bug bounty (via Python script)
- Attach tests to external contracts and impersonate accounts (in mainnet fork)

## Getting Started

Click the [`Use this template`](https://github.com/MarioPoneder/solidity-audit-template/generate) button at the top of
the page to create a new repository with this repo as the initial state.

## Features

This template builds upon the frameworks and libraries mentioned above, so for details about their specific features,
please consult their respective documentations.

For example, for Hardhat, you can refer to the [Hardhat Tutorial](https://hardhat.org/tutorial) and the
[Hardhat Docs](https://hardhat.org/docs). You might be in particular interested in reading the
[Testing Contracts](https://hardhat.org/tutorial/testing-contracts) section.

### Sensible Defaults

This template comes with sensible default configurations in the following files:

```text
├── .commitlintrc.yml
├── .editorconfig
├── .eslintignore
├── .eslintrc.yml
├── .gitignore
├── .prettierignore
├── .prettierrc.yml
├── .solcover.js
├── .solhintignore
├── .solhint.json
├── .yarnrc.yml
└── hardhat.config.ts
```

### GitHub Actions

This template comes with GitHub Actions pre-configured (disabled per default). Your contracts will be linted and tested
on every push and pull request made to the `main` branch.

Note though that to make this work, you must use your `INFURA_API_KEY` and your `MNEMONIC` as GitHub secrets and rename
the CI script to `ci.yml` in order to enable it.

You can edit the CI script in [.github/workflows/ci.yml.example](./.github/workflows/ci.yml.example).

### Conventional Commits

This template enforces the [Conventional Commits](https://www.conventionalcommits.org/) standard for git commit
messages. This is a lightweight convention that creates an explicit commit history, which makes it easier to write
automated tools on top of.

### Git Hooks

This template uses [Husky](https://github.com/typicode/husky) to run automated checks on commit messages, and
[Lint Staged](https://github.com/okonet/lint-staged) to automatically format the code with Prettier when making a git
commit.

## Usage

### Pre Requisites

Before being able to run any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an
environment variable. You can follow the example in `.env.example`. If you don't already have a mnemonic, you can use
this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
$ yarn install
$ pip install -r contract-downloader/requirements.txt  # for Python contract downloader
```

### Example usage: External contract testing

1. Download external contract + dependencies or download contracts from Immunefi bug bounty

```sh
$ yarn clone <contract address>
# OR
$ yarn immunefi <bug bounty URL>
```

2. Set Solidity version in `hardhat.config.ts`
3. Compile contract(s) and generate typings

```sh
$ yarn compile
```

4. Export the contracts' storage layouts

```sh
$ yarn storage
```

5. Fork the mainnet as a local Hardhat Network instance

```sh
$ yarn fork
```

6. Adapt the test templates to break/exploit the external contract in the local Hardhat Network instance

```sh
$ yarn attach <contract address>
$ yarn attachContract <contract address>
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain bindings:

```sh
$ yarn typechain
```

### Test

Run the Mocha test for the example Greeter contract:

```sh
$ yarn test
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

Starts an instance of Hardhat Network that forks mainnet. This means that it will simulate having the same state as
mainnet, but it will work as a local development network. That way you can interact with deployed protocols and test
complex interactions locally.

To use this feature you need to set your Infura API key in the `.env` file.

```sh
$ yarn fork
$ yarn fork --fork-block-number <num>  # pin the block number
```

### Network Fork

Starts an instance of Hardhat Network that forks an EVM based network. Supported networks are given by `chainIds[]` in
`hardhat.config.ts`.

```sh
$ yarn forkNetwork --network <chain>  # e.g. rinkeby or polygon-mainnet
```

### Clone (with Python contract downloader)

Downloads a verified smart contract and its dependencies from Etherscan, etc. To use this feature you need to set the
relevant API keys in the `.env` file.

```sh
$ yarn clone <contract address>
$ yarn clone <contract address> --network <chain>  # e.g. polygon or bsc
```

In order to remove a previously downloaded smart contract and its dependencies from the local filesystem, run:

```sh
$ yarn clone <contract address> --remove
```

Furthermore, implementation contracts can be downloaded through proxies by:

```sh
$ yarn clone <proxy contract address> --impl
```

### Immunefi (with Python contract downloader)

Gathers all block explorer links to verified smart contracts in scope from an Immunefi bug bounty page and forwards them
to the downloader, see [Clone](#clone).

```sh
$ yarn immunefi <bug bounty URL>
$ yarn immunefi <bug bounty URL> --remove  #  delete contracts
```

### Attach test to external contract

Attaches the Mocha test `external/Attach` to a deployed contract in your local Hardhat Network (e.g. mainnet fork). The
test contains sample code for the Greeter contract and therefore needs to be adapted according to your needs.

```sh
$ yarn attach <contract address> [--impersonate <address>]
```

Features like [Report Gas](#report-gas) and [Tracer](#tracer) can also be used with this test.

### Attach test contract to external contract

Attaches the Mocha test `external/AttachContract` and the contract `test/Test` to a deployed contract in your local
Hardhat Network (e.g. mainnet fork). The test contains sample code for the Greeter contract and therefore needs to be
adapted according to your needs.

```sh
$ yarn attachContract <contract address> [--impersonate <address>]
```

Features like [Report Gas](#report-gas) and [Tracer](#tracer) can also be used with this test.

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Clean contracts

Delete all non-template contracts from the contract directory:

```sh
$ yarn cleanContracts
```

### Clean all

Combines [Clean](#clean) and [Clean contracts](#clean-contracts):

```sh
$ yarn cleanAll
```

### Deploy

Deploy the example Greeter contract to the Hardhat Network:

```sh
$ yarn deploy --greeting "Hello, world!"
```

## Tips

### Syntax Highlighting

If you use VSCode, you can get Solidity syntax highlighting with the
[hardhat-solidity](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) extension.

## Using GitPod

[GitPod](https://www.gitpod.io/) is an open-source developer platform for remote development.

To view the coverage report generated by `yarn coverage`, just click `Go Live` from the status bar to turn the server
on/off.

## License

[MIT](./LICENSE.md) © Paul Razvan Berg & Mario Poneder
