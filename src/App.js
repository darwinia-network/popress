import "./App.css";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useState, useEffect } from "react";
import { typesBundleForPolkadotApps } from "@darwinia/types/mix";
import { web3FromAddress, web3Enable } from "@polkadot/extension-dapp";

web3Enable("polkadot-js/apps");

const api = new ApiPromise({
  provider: new WsProvider("wss://pangolin-rpc.darwinia.network"),
  typesBundle: typesBundleForPolkadotApps,
});

const signer = "5FA7CzAgT5fNDFRdb4UWSZX3b9HJsPuR7F5BF4YotSpKxAA2";

function App() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("Pending");
  const [hash, setHash] = useState("");

  useEffect(() => {
    (async () => {
      await api.isReady;
      const balance = await api.rpc.balances.usableBalance(0, signer);

      setBalance(balance.usableBalance.toString());
    })();
  }, []);

  return (
    <div className="App">
      <div className="indicator">
        {status}
      </div>
      <form className="form">
        <label>Sender</label>
        <input
          type="text"
          placeholder="Type the sender account"
          onChange={event => {
            const value = event.target.value;

            setRecipient(value);
          }}
        />
        <p>RING balance: {String(Number(balance) / Math.pow(10, 9))}</p>

        <label>Amount</label>
        <input
          type="number"
          placeholder="Type RING amount"
          onChange={event => {
            const value = event.target.value;

            setAmount(value);
          }}
        />
      </form>

      <button
        onClick={async () => {
          const wei = amount + "0".padEnd(9, "0");
          const extrinsic = api.tx.balances.transfer(recipient, wei);
          const injector = await web3FromAddress(signer);

          api.setSigner(injector.signer);

          extrinsic.signAndSend(signer, result => {
            if (!result || !result.status) {
              return;
            }

            const { error, finalized } = result.status.toJSON();

            if (result.status.isBroadcast) {
              setStatus("broadcast");
            }

            if (result.status.isReady) {
              setStatus("queued");
            }

            if (result.status.isInBlock) {
              setStatus("inblock");
            }

            if (result.status.isFinalized) {
              setStatus("finalized");
              setHash(finalized);

              setTimeout(() => {
                setStatus("pending");
              }, 3000);
            }

            if (result.isError) {
              setStatus("error");
              console.error("------>", error);
            }
          });
        }}
      >
        Submit
      </button>

      <p className="hash">Transaction Hash: {hash}</p>
    </div>
  );
}

export default App;
