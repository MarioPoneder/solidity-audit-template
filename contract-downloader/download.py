import os
import json
import argparse
from dotenv import load_dotenv

from etherscan import Etherscan
from polygonscan import PolygonScan


def _fakeInstallModule(sourceFilePath):
    if "node_modules" in sourceFilePath:
        modulePath = os.path.dirname(sourceFilePath)
        while not os.path.dirname(os.path.dirname(modulePath)).endswith("node_modules"):
            modulePath = os.path.dirname(modulePath)
        
        modulePackageFilePath = modulePath + "/package.json"
        if not os.path.exists(modulePackageFilePath):
            with open(modulePackageFilePath, 'w', encoding='utf-8') as f:
                f.write("{ \"name\": \"\", \"version\": \"\" }")



def _download(eth, contractAddress, remove):
    # get contract source code + dependencies
    contracts = eth.get_contract_source_code(contractAddress)

    for contract in contracts:
        contractName = contract["ContractName"]
        print("----- Contract:", contractName, "-----")

        # parse contract source code + dependencies form JSON
        sourceFiles = json.loads(contract["SourceCode"][1:-1])["sources"]

        # replicate directory tree of contract source code + dependencies
        for sourceFileReference in sourceFiles:
            sourceFilePath = sourceFileReference
            isModule = sourceFilePath[0] == "@"
            
            if isModule:  # put modules in 'node_modules'
                sourceFilePath = "node_modules/" + sourceFilePath
            elif not sourceFilePath.startswith("contracts/"):
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
                    os.rmdir(os.path.dirname(sourceFilePath))
                except Exception:
                    pass


if __name__ == "__main__":
    try:
        # get contract address and network from command line
        parser = argparse.ArgumentParser(description='Downloads a verified smart contract and its dependencies from Etherscan, etc.')
        parser.add_argument('contractAddress', type=str, help='address of a verified contract')
        parser.add_argument('-n', '--network', type=str, help='network: mainnet or polygon (default=mainnet)', default='mainnet')
        parser.add_argument('-r', '--remove', action='store_true', help='remove previously downloaded contract from local filesystem')
        args = parser.parse_args()
        
        # get API keys from .env file
        load_dotenv()
        etherscanApiKey = os.getenv('ETHERSCAN_API_KEY')
        polygonscanApiKey = os.getenv('POLYGONSCAN_API_KEY')
        
        
        if not args.remove:
            print("Downloading", args.network, "contract", args.contractAddress, "...")
        else:
            print("Removing", args.network, "contract", args.contractAddress, "...")
        
        if args.network == "mainnet":
            eth = Etherscan(etherscanApiKey)
            _download(eth, args.contractAddress, args.remove)
        elif args.network == "polygon":
            with PolygonScan(polygonscanApiKey, False) as eth:
                _download(eth, args.contractAddress, args.remove)
        else:
            print("Unsupported network!")
        
        print("")
        print("Done!")
    except Exception as e:
        print("Error:", e)
        
