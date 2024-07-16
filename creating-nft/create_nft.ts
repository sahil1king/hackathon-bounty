import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const INITIAL_BALANCE = 100_000_000;

const APTOS_NETWORK: Network = Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const step2 = async () => {
  console.log(
    "This code will create and fund John and Ron. John will create a collection and a digital asset in that collection and transfer it to Ron.",
  );

  const john = Account.generate();
  const ron = Account.generate();

  console.log("== Addresses ==\n");
  console.log(`John's address is: ${john.accountAddress}`);

  // Fund and create the accounts
  await aptos.faucet.fundAccount({
    accountAddress: john.accountAddress,
    amount: INITIAL_BALANCE,
  });
  await aptos.faucet.fundAccount({
    accountAddress: ron.accountAddress,
    amount: INITIAL_BALANCE,
  });

  const collectionName = "bounty Collection";
  const collectionDescription = "This is a sample collection of the bounty NFTs";
  const collectionURI = "aptos.dev";

  const createCollectionTransaction = await aptos.createCollectionTransaction({
    creator: john,
    description: collectionDescription,
    name: collectionName,
    uri: collectionURI,
  });

  console.log("\n== Create the collection ==\n");
  let committedTxn = await aptos.signAndSubmitTransaction({ signer: john, transaction: createCollectionTransaction });
  let pendingTxn = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

  const johnsCollection = await aptos.getCollectionData({
    creatorAddress: john.accountAddress,
    collectionName,
    minimumLedgerVersion: BigInt(pendingTxn.version),
  });
  console.log(`john's collection: ${JSON.stringify(johnsCollection, null, 4)}`);

  const tokenName = "Asset 1";
  const tokenDescription = "This is the first asset of the token collection";
  const tokenURI = "bounty/asset";

  console.log("\n== John Mints the digital asset ==\n");

  const mintTokenTransaction = await aptos.mintDigitalAssetTransaction({
    creator: john,
    collection: collectionName,
    description: tokenDescription,
    name: tokenName,
    uri: tokenURI,
  });

  committedTxn = await aptos.signAndSubmitTransaction({ signer: john, transaction: mintTokenTransaction });
  pendingTxn = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

  const johnsDigitalAsset = await aptos.getOwnedDigitalAssets({
    ownerAddress: john.accountAddress,
    minimumLedgerVersion: BigInt(pendingTxn.version),
  });
  console.log(`john's digital assets balance: ${johnsDigitalAsset.length}`);
  console.log(`john's digital asset: ${JSON.stringify(johnsDigitalAsset[0], null, 4)}`);
  
  console.log("\n== Transfer the digital asset to ron ==\n");
  const transferTransaction = await aptos.transferDigitalAssetTransaction({
    sender: john,
    digitalAssetAddress: johnsDigitalAsset[0].token_data_id,
    recipient: ron.accountAddress,
  });
  committedTxn = await aptos.signAndSubmitTransaction({ signer: john, transaction: transferTransaction });
  pendingTxn = await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

  const johnsDigitalAssetsAfter = await aptos.getOwnedDigitalAssets({
    ownerAddress: john.accountAddress,
    minimumLedgerVersion: BigInt(pendingTxn.version),
  });
  console.log(`john's digital assets balance: ${johnsDigitalAssetsAfter.length}`);

  const ronDigitalAssetsAfter = await aptos.getOwnedDigitalAssets({
    ownerAddress: ron.accountAddress,
    minimumLedgerVersion: BigInt(pendingTxn.version),
  });
  console.log(`ron's digital assets balance: ${ronDigitalAssetsAfter.length}`);
};

step2();