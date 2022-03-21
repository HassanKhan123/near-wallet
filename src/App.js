import { connect, KeyPair, keyStores } from "near-api-js";
import { useEffect, useState } from "react";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import BN from "bn.js";

import { generateSeedPhrase } from "./utils";

function App() {
  const [id, setId] = useState("");
  const [publicKey, setPublickKey] = useState("");
  const [privateKey, setPrivatekKey] = useState("");

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
    const phrase = generateSeedPhrase();
    console.log("PHRASE===========", phrase);
    setPublickKey(phrase.publicKey);
    setPrivatekKey(phrase.secretKey);
  }, []);

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
  };

  const createAccount = async () => {
    const accountInfo = await near.account(id);
    const state = await checkAccountStatus(accountInfo);
    if (state) {
      alert("Account with this name already present");
    } else {
      await near.createAccount(id, publicKey);
      console.log("STATE=========", state);
      alert(`Account Created!!! Your ID is ${id}`);
      fetchBalance(id);
    }
  };

  const sendFunds = async () => {
    let sender = "puranaoffice.testnet";
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
    const transaction = await senderAccount.sendMoney("pizza.testnet", amount);
    console.log("HASH========", transaction.transaction.hash);
  };

  return (
    <div className="App">
      <input value={id} onChange={e => setId(e.target.value)} />
      <button onClick={createAccount}>Create Account</button>

      <p>Your balance is {balance}</p>

      <button onClick={sendFunds}>Send Funds</button>
    </div>
  );
}

export default App;
