import { connect, KeyPair, keyStores } from "near-api-js";
import { useEffect, useState } from "react";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import BN from "bn.js";

import {
  generateSeed,
  parseSeedPhrase,
  parseSeedPhraseToAddress,
} from "./utils";
import "./App.css";

function App() {
  const [id, setId] = useState("");
  const [publicKey, setPublickKey] = useState("");
  const [privateKey, setPrivatekKey] = useState("");
  const [accountID, setAccountID] = useState("");
  const [phrase, setPhrase] = useState("");
  const [initialMnemonic, setInitialMnemonic] = useState("");
  const [sender, setSender] = useState("");

  const [near, setNear] = useState({});
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      const near = await connect({
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      });
      setNear(near);
    })();
  }, []);

  useEffect(() => {
    const { phrase, address, secret } = generateSeed();
    console.log("PSJ====", phrase, address, secret);

    setPublickKey(address);
    setPrivatekKey(secret);
    setInitialMnemonic(phrase);
  }, []);

  const grantPermission = () => {
    const { publicKey, secretKey } = parseSeedPhraseToAddress(phrase);
    setPublickKey(publicKey);
    setPrivatekKey(secretKey);
  };

  const checkAccountStatus = async accountInfo => {
    try {
      await accountInfo.state();
      return true;
    } catch (error) {
      console.log("er=====", error);
      return false;
    }
  };

  const fetchBalance = async id => {
    const account = await near.account(id);
    const balance = await account.getAccountBalance();
    console.log("BAL======", balance);
    setBalance(balance.available / 10 ** 24);
    console.log(
      await account.getAccountDetails(),
      await account.getAccessKeys()
    );
  };
  // pupil method interest album short combine spend betray climb remove analyst swift

  const importAccount = async () => {
    const newAccount = await near.account(accountID);
    setSender(accountID);

    const balance = await newAccount.getAccountBalance();
    console.log(await newAccount.getAccessKeys());
    setBalance(balance.available / 10 ** 24);
  };

  const createAccount = async () => {
    const accountInfo = await near.account(id);
    const state = await checkAccountStatus(accountInfo);
    if (state) {
      alert("Account with this name already present");
    } else {
      await near.createAccount(id, publicKey);
      setSender(id);
      console.log("STATE=========", state);
      alert(`Account Created!!! Your ID is ${id}`);
      fetchBalance(id);
    }
  };

  const sendFunds = async () => {
    try {
      let receiver = "pakistanday.testnet";
      let networkId = "testnet";
      const keyStore = new keyStores.InMemoryKeyStore();
      console.log(":KEY========", keyStore, privateKey);
      const keyPair = KeyPair.fromString(privateKey);
      await keyStore.setKey("testnet", sender, keyPair);

      const config = {
        networkId,
        keyStore,
        nodeUrl: `https://rpc.${networkId}.near.org`,
        walletUrl: `https://wallet.${networkId}.near.org`,
        helperUrl: `https://helper.${networkId}.near.org`,
        explorerUrl: `https://explorer.${networkId}.near.org`,
      };

      // connect to NEAR! :)
      const near = await connect(config);
      // create a NEAR account object
      const senderAccount = await near.account(sender);

      const yoctoAmount = parseNearAmount("5");
      const amount = new BN(yoctoAmount);
      const transaction = await senderAccount.sendMoney(receiver, amount);
      console.log("HASH========", transaction.transaction.hash);
    } catch (error) {
      console.log("err=============", error.message);
      if (
        error.message.includes("no matching key pair found in InMemorySigner")
      ) {
        alert("You dont have permission");
      }
    }
  };

  return (
    <div className="App">
      <h1>Seed Phrase: {initialMnemonic}</h1>
      <input value={id} onChange={e => setId(e.target.value)} />
      <button onClick={createAccount}>Create Account</button>

      <p>Your balance is {balance}</p>

      <button onClick={sendFunds}>Send Funds</button>

      <input value={accountID} onChange={e => setAccountID(e.target.value)} />
      <button onClick={importAccount}>Import Account</button>

      <input value={phrase} onChange={e => setPhrase(e.target.value)} />
      <button onClick={grantPermission}>Grant permission</button>
    </div>
  );
}

export default App;
