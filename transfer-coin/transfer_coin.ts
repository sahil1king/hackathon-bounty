import { Account, AccountAddress, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK: Network = Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const JOHN_INITIAL_BALANCE = 100_000_000;
const RON_INITIAL_BALANCE = 0;
const TRANSFER_AMOUNT = 1_000_000;

const balance = async (name: string, accountAddress: AccountAddress, versionToWaitFor?: bigint): Promise<number> => {
  const amount = await aptos.getAccountAPTAmount({
    accountAddress,
    minimumLedgerVersion: versionToWaitFor,
  });
  console.log(`${name}'s balance is: ${amount}`);
  return amount;
};

const step1 = async () => {
  console.log(
    "This code creates two accounts (Alice and Bob), funds Alice, and transfers between them using transferCoinTransaction.",
  );

  const john = Account.generate();
  const ron = Account.generate();

  console.log("== Addresses ==\n");
  console.log(`john's address is: ${john.accountAddress}`);
  console.log(`ron's address is: ${ron.accountAddress}`);

  console.log("\n== Funding john's account ==\n");
  await aptos.fundAccount({
    accountAddress: john.accountAddress,
    amount: JOHN_INITIAL_BALANCE,
  });

  console.log("\n== Initial Balances ==\n");
  const aliceBalance = await balance("John", john.accountAddress);
  const bobBalance = await balance("Ron", ron.accountAddress);

  console.log(`\n== Transfer ${TRANSFER_AMOUNT} from Alice to Bob ==\n`);
  const transaction = await aptos.transferCoinTransaction({
    sender: john.accountAddress,
    recipient: ron.accountAddress,
    amount: TRANSFER_AMOUNT,
  });
  const pendingTxn = await aptos.signAndSubmitTransaction({ signer: john, transaction });
  const response = await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
  console.log(`Committed transaction: ${response.hash}`);

  console.log("\n== Balances after transfer ==\n");
  const newAliceBalance = await balance("John", john.accountAddress, BigInt(response.version));
  const newBobBalance = await balance("Ron", ron.accountAddress);

  if (newBobBalance !== TRANSFER_AMOUNT + RON_INITIAL_BALANCE)
    throw new Error("Ron's balance after transfer is incorrect");

  if (newAliceBalance >= JOHN_INITIAL_BALANCE - TRANSFER_AMOUNT)
    throw new Error("John's balance after transfer is incorrect");
};

step1();