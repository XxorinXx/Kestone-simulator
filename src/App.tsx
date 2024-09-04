import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import QRCode from "react-qr-code";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import cbor from "cbor";
function App() {
  const connection = new Connection(
    "https://crimson-alpha-spring.solana-mainnet.quiknode.pro/668fb6052225301a8eba0947990aa407b614bc5e/"
  );

  const wallet1 = Keypair.fromSecretKey(
    bs58.decode("3Hhxpp7bi7P4gACqzmwppqaUA7EHTatTpSYbqeZqHbMzSkxykaoiYdr3hojc7gYsgLbMgHUKVBqZqEnXqwAbkJT5")
  );
  const wallet2 = Keypair.fromSecretKey(
    bs58.decode("2xgJbDptH2Bu2VxYswjxVi4CPr3u5fUTzswed7NZn9TD3fYfoo91tuuUFXZ4Ds4SFZ1vYxoUyCRwzK5bXMJ7H8EP")
  );
  const keyPairs: Keypair[] = [wallet1, wallet2];

  const [openScanner, setOpenScanner] = useState(false);
  const [signatureQr, setSignatureQr] = useState<Signature>();

  const pathMapping: { [key: string]: Keypair } = {
    "m/44'/501'/0'": keyPairs[0],
    "m/44'/501'/1'": keyPairs[1],
  };

  const onScan = (result: IDetectedBarcode[]) => {
    console.log(result[0].rawValue);
    const stringData = cbor.decode(result[0].rawValue);
    const data = JSON.parse(stringData) as solSignRequest;
    const wallet = pathMapping[data.path];
    console.log(data.path);
    console.log(wallet.publicKey.toString());
    console.log(data.signData);

    ///sign
    const uint8Tx = new Uint8Array(Buffer.from(data.signData, "base64"));
    // uint8Tx.
    // Transaction.from(uint8Tx);

    //generate new qr
  };

  const getQrDataConnect = () => {
    return JSON.stringify({
      masterFingerprint: "f23f9fd2",
      keys: [
        {
          chain: "SOL",
          path: "m/44'/501'/0'",
          publicKey: keyPairs[0].publicKey.toString(),
          name: "SOL-0",
          chainCode: "",
          extendedPublicKey: "",
        },
        {
          chain: "SOL",
          path: "m/44'/501'/1'",
          publicKey: keyPairs[1].publicKey.toString(),
          name: "SOL-1",
          chainCode: "",
          extendedPublicKey: "",
        },
      ],
      device: "Keystone",
    });
  };
  return (
    <>
      <h3>My wallets</h3>
      <div style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {keyPairs.map((wallet) => (
          <h5 style={{ marginBottom: -20 }}>{wallet.publicKey.toString()}</h5>
        ))}
      </div>
      <button title="f" onClick={() => console.log(getQrDataConnect())} />
      <h1>Fuse + KeyStone</h1>
      <h3>Scan to connect</h3>
      <QRCode value={signatureQr ? JSON.stringify(signatureQr) : getQrDataConnect()} />
      <button
        style={{ width: 300, height: 100 }}
        onClick={() => {
          setOpenScanner(!openScanner);
        }}
      >
        <h2>{openScanner ? "Close qr scanner" : "Scan tx qr"}</h2>
      </button>
      <button title="hey" onClick={() => console.log(pathMapping["m/44'/501'/1'"])} />

      {openScanner && <Scanner onScan={onScan} />}
    </>
  );
}

export default App;

interface solSignRequest {
  requestId: string;
  signData: string; //should be buffer acording to the docs
  dataType: string;
  path: string;
  xfp: string;
  origin: string;
}

interface Signature {
  requestId: String; // the requestId from sign request
  signature: String; // the serialized signature in hex string
}
