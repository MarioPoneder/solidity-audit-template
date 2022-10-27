import requests
import argparse
from bs4 import BeautifulSoup

import download

# dict: block explorer name <-> network name (for contract downloader)
supportedExplorers = { "etherscan": "mainnet", "polygonscan": "polygon", "bscscan": "bsc" }

if __name__ == "__main__":
    try:
        # get contract address and network from command line
        parser = argparse.ArgumentParser(description='Gathers all block explorer links to verified smart contracts in scope from an Immunefi bug bounty page and forwards them to the downloader.')
        parser.add_argument('bountyUrl', type=str, help='bug bounty URL, e.g. https://immunefi.com/bounty/vulnerableproject/')
        parser.add_argument('-r', '--remove', action='store_true', help='remove bounty contracts from local filesystem')
        args = parser.parse_args()
        
        # download bug bounty page
        page = requests.get(args.bountyUrl)
        soup = BeautifulSoup(page.content, "html.parser")

        # find all assets in scope with hyperlink
        assetsInScope = soup.find("h3", string="Assets in scope").parent
        assetLinks = assetsInScope.find_all("a")
        contracts = []
        
        # filter asset links to get contracts only
        for assetLink in assetLinks:
            assetLink = assetLink.text.strip()
            for explorer in supportedExplorers:
                if ("/"+explorer+".") in assetLink: # check if link to supported block explorer
                    addressPos = assetLink.index('0x')
                    contractAddress = assetLink[addressPos:addressPos+42] # get 20 bytes hex address from link
                    contracts.append((explorer, contractAddress))
                    break
        
        # forward found contracts to downloader
        skippedContracts = []
        for contract in contracts:
            #print(contract)
            try:
                download.start(supportedExplorers[contract[0]], contract[1], args.remove, True) # always try to resolve implementation contract
            except Exception as e:
                print("Warning:", e)
                skippedContracts.append(contract)
        
        if len(skippedContracts) > 0:
            print("")
            print("Skipped contracts due to errors:")
            for contract in skippedContracts:
                print(contract)
        
        print("")
        print("Done!")
    except Exception as e:
        print("Error:", e)
        
