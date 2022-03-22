import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
import nacl from "tweetnacl";
import * as bip39 from "bip39";
import { hdkey } from "ethereumjs-wallet";
import { ethers } from "ethers";
import { KeyPair } from "near-api-js";
import { generateSeedPhrase, parseSeedPhrase } from "near-seed-phrase";

// const KEY_DERIVATION_PATH = `m/44'/60'/0'/0/0`;
const KEY_DERIVATION_PATH = "m/44'/397'/0'";

export const generateSeed = entropy => {
  const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
  const recoveryKeyPair = KeyPair.fromString(secretKey);
  return {
    phrase: seedPhrase,
    address: recoveryKeyPair.getPublicKey().toString(),
    secret: recoveryKeyPair.secretKey,
  };
};

// taste hybrid oppose tent eye deer west uncle behind choose claim impact
// pleasemeribaatsuno.testnet

const normalizeSeedPhrase = seedPhrase =>
  seedPhrase
    .trim()
    .split(/\s+/)
    .map(part => part.toLowerCase())
    .join(" ");

export const parseSeedPhraseToAddress = (phrase, derivationPath) => {
  const { publicKey, secretKey, seedPhrase } = parseSeedPhrase(phrase);
  console.log("recover====", publicKey, secretKey, seedPhrase);
  return { publicKey, secretKey };

  // const seed = bip39.mnemonicToSeed(normalizeSeedPhrase(phrase));
  // const { key } = derivePath(
  //   derivationPath || KEY_DERIVATION_PATH,
  //   seed.toString("hex")
  // );
  // const keyPair = nacl.sign.keyPair.fromSeed(key);
  // const publicKey = "ed25519:" + bs58.encode(Buffer.from(keyPair.publicKey));
  // const secretKey = "ed25519:" + bs58.encode(Buffer.from(keyPair.secretKey));
  // return { phrase, secretKey, publicKey };
};

export const findSeedPhraseKey = (seedPhrase, publicKeys) => {
  // TODO: Need to iterate through multiple possible derivation paths?
  const keyInfo = parseSeedPhrase(seedPhrase);
  if (publicKeys.indexOf(keyInfo.publicKey) < 0) {
    return {};
  }
  return keyInfo;
};
