import { derivePath } from "near-hd-key";
import bs58 from "bs58";
import nacl from "tweetnacl";
import * as bip39 from "bip39";

const KEY_DERIVATION_PATH = "m/44'/397'/0'";

export const generateSeedPhrase = entropy => {
  return parseSeedPhrase(
    entropy !== undefined
      ? bip39.entropyToMnemonic(entropy)
      : // : bip39.generateMnemonic()
        "twelve then small nut cry maid faith hair rabbit own employ agree"
  );
};

const normalizeSeedPhrase = seedPhrase =>
  seedPhrase
    .trim()
    .split(/\s+/)
    .map(part => part.toLowerCase())
    .join(" ");

export const parseSeedPhrase = (seedPhrase, derivationPath) => {
  const seed = bip39.mnemonicToSeed(normalizeSeedPhrase(seedPhrase));
  const { key } = derivePath(
    derivationPath || KEY_DERIVATION_PATH,
    seed.toString("hex")
  );
  const keyPair = nacl.sign.keyPair.fromSeed(key);
  const publicKey = "ed25519:" + bs58.encode(Buffer.from(keyPair.publicKey));
  const secretKey = "ed25519:" + bs58.encode(Buffer.from(keyPair.secretKey));
  return { seedPhrase, secretKey, publicKey };
};

export const findSeedPhraseKey = (seedPhrase, publicKeys) => {
  // TODO: Need to iterate through multiple possible derivation paths?
  const keyInfo = parseSeedPhrase(seedPhrase);
  if (publicKeys.indexOf(keyInfo.publicKey) < 0) {
    return {};
  }
  return keyInfo;
};
