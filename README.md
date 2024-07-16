# hackathon-bounty

**<transfer-coin>**

I used Aptos typescript SDK. SDK - Software Development Kit, collection of software tools and dependencies used by developers,
Aptos typescript SDK is designed to help developers to buildD-apps on aptos blockchain.
To install the Aptos SDK I used this command  - npm i @aptos-labs/ts-sdk 

After installing required dependencies I started with writing the code in transfer_coin.ts but before that one should know about devnet.

DEVNET- The Aptos Devnet is the development network designed for developers to test and experiment with their applications before deploying them on the mainnet

Let's jump to code of **transfer_coin.ts**

first we have **balance** function which will help in fetch and print the balance of one's account
Then we have **getAccountAPTAmount** it queries the index service
and **step1**  to encapsulates the workflow and execution sequence for the entire process of creating accounts, funding one, transferring tokens, and checking balances
**Account.generate** will create the accounts of john and ron
**accountAddress** will display the account's address
**fundAccount** this function will fund the john's account
**transferCoinTransaction** it will submit the transaction on chain that twill return us the transaction hash by which we can check our transaction on the devnet of **aptos_explorer** 
**waitForTransaction** this function will return us the transaction or will throw error if the process exceeds the timeout

we set up our Aptos client, created two accounts, and funded them.

![transfer-coin's output](https://github.com/user-attachments/assets/b5ba7e3b-ed44-41d7-bb82-059884282d0e)
this screenshot shows the output of the code with fund transfered from john's account to ron's account 

![balance-change ](https://github.com/user-attachments/assets/4e520abc-a82f-434e-b256-1f9df4c17d65)
this screenshot shows the data from aptos explorer of balance change of acoounts 



**<creating-nft>**

NFT's - Aptos provides a robust platform for creating, managing, and trading Non-Fungible Tokens (NFTs).These digital assets are
organized into collections, which act as containers that group similar items under a common theme or purpose. This makes it
easier to manage and categorize them.

We gonna use the same typescript SDK to create NFT collection and token

**createCollectionTransaction** -- We will create the  collection name, description and URI
After that calls createCollectionTransaction that will sign and submit to the blockchain.

**SingleSignerTransaction** will simulate or submit to chain

**mintDigitalAssetTransaction** will return a single signer transaction that will be submitted to the chain

**getCollectionData** will query the metadata of the collection

**minimumLedgerVersion** This is used to specify the earliest ledger version from which the data will be considered valid

**getOwnedDigitalAssets** will query the metadata of a user's owned token using and will return information such as the owner address, token data id, last transaction timestamp and uri

![Creation of NFT](https://github.com/user-attachments/assets/1cd4c63f-1a02-4cd1-87e8-1c5c50428c1e)
this screenshot shows the creation of nft and token transfer to ron's account

![token-transfered](https://github.com/user-attachments/assets/10993bb5-0cdf-477f-9e31-7a40457d6f65)
this screenshot shows the creation and transfer of asset on aptos explorer


