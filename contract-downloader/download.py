import os
import json
import argparse
from dotenv import load_dotenv

from etherscan import Etherscan
from polygonscan import PolygonScan
from bscscan import BscScan


def _fakeInstallModule(sourceFilePath):
    if "node_modules" in sourceFilePath:
        modulePath = os.path.dirname(sourceFilePath)
        while not os.path.dirname(os.path.dirname(modulePath)).endswith("node_modules"):
            modulePath = os.path.dirname(modulePath)
        
        modulePackageFilePath = modulePath + "/package.json"
        if not os.path.exists(modulePackageFilePath):
            with open(modulePackageFilePath, 'w', encoding='utf-8') as f:
                f.write("{ \"name\": \"\", \"version\": \"\" }")


def _download(eth, contractAddress, remove, resolveImpl):
    # get contract source code + dependencies
    contracts = eth.get_contract_source_code(contractAddress)

    for contract in contracts:
        contractName = contract["ContractName"]
        if contractName == "":
            raise Exception("No code found at this address!")
        print("----- Contract:", contractName, "-----")
        if resolveImpl and contract["Proxy"] == "1":
            implAddress = contract["Implementation"]
            print("Proxy! -> Using implementation contract", implAddress, "instead ...")
            _download(eth, implAddress, remove, False)
            return
        
        # parse contract source code + dependencies form JSON
        try:
            sourceFiles = json.loads(contract["SourceCode"][1:-1])["sources"]
        except json.decoder.JSONDecodeError:
            print("Warning: Failed to get individual source files. Contract was probably merged to single file upon verification.")
            sourceFiles = { contractName + ".sol" : { "content" : contract["SourceCode"] } }

        # replicate directory tree of contract source code + dependencies
        for sourceFileReference in sourceFiles:
            sourceFilePath = sourceFileReference
            isModule = sourceFilePath[0] == "@"
            
            if isModule:  # put modules in 'node_modules'
                sourceFilePath = "node_modules/" + sourceFilePath
            elif not (sourceFilePath.startswith("contracts/") or sourceFilePath.startswith("/contracts/")):
                sourceFilePath = "contracts/" + sourceFilePath
                
            # make absolute path
            sourceFilePath = os.path.abspath("./" + sourceFilePath)
            print(os.path.relpath(sourceFilePath))
            
            if not remove:
                os.makedirs(os.path.dirname(sourceFilePath), exist_ok=True)
                if isModule:
                    _fakeInstallModule(sourceFilePath)

                with open(sourceFilePath, 'w', encoding='utf-8') as f:
                    f.write(sourceFiles[sourceFileReference]["content"])
            else:
                try:
                    os.remove(sourceFilePath)
                    parentDir = os.path.dirname(sourceFilePath)
                    for i in range(4): # try to remove empty parent dirs
                        os.rmdir(parentDir)
                        parentDir = os.path.dirname(parentDir)
                except Exception:
                    pass


def start(network, contractAddress, remove, resolveImpl):
    # get API keys from .env file
    load_dotenv()
    etherscanApiKey = os.getenv('ETHERSCAN_API_KEY')
    polygonscanApiKey = os.getenv('POLYGONSCAN_API_KEY')
    bscscanApiKey = os.getenv('BSCSCAN_API_KEY')
    
    if not remove:
        print("Downloading", network, "contract", contractAddress, "...")
    else:
        print("Removing", network, "contract", contractAddress, "...")
    
    if network == "mainnet":
        eth = Etherscan(etherscanApiKey)
        _download(eth, contractAddress, remove, resolveImpl)
    elif network == "polygon":
        with PolygonScan(polygonscanApiKey, False) as eth:
            _download(eth, contractAddress, remove, resolveImpl)
    elif network == "bsc":
        with BscScan(bscscanApiKey, False) as eth:
            _download(eth, contractAddress, remove, resolveImpl)
    else:
        print("Unsupported network!")


if __name__ == "__main__":
    try:
        # get contract address and network from command line
        parser = argparse.ArgumentParser(description='Downloads a verified smart contract and its dependencies from Etherscan, etc.')
        parser.add_argument('contractAddress', type=str, help='address of a verified contract')
        parser.add_argument('-n', '--network', type=str, help='network: mainnet, polygon or bsc (default=mainnet)', default='mainnet')
        parser.add_argument('-i', '--impl', action='store_true', help='if specified contract is proxy: resolve and download implementation instead')
        parser.add_argument('-r', '--remove', action='store_true', help='remove previously downloaded contract from local filesystem')
        args = parser.parse_args()
        
        start(args.network, args.contractAddress, args.remove, args.impl)
        
        print("")
        print("Done!")
    except Exception as e:
        print("Error:", e)
        
