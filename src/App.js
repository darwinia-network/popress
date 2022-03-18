import { typesBundleForPolkadotApps } from '@darwinia/types/mix';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { useEffect, useState } from 'react';
import './App.css';

const signer = '5GNjaEkQEz2KJMb95dkC17HXJj8wJNDTjtbRoDNp4LSCMTh8';

function App() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [status, setStatus] = useState('Pending');
  const [hash, setHash] = useState('');
  const [api, setApi] = useState();

  useEffect(() => {
    (async () => {
      const api = new ApiPromise({
        provider: new WsProvider('wss://pangolin-rpc.darwinia.network'),
        typesBundle: typesBundleForPolkadotApps,
      });

      await api.isReady;

      const res = await web3Enable('polkadot-js/apps');
      const accounts = await web3Accounts();

      console.log('%c [ res ]-27', 'font-size:13px; background:pink; color:#bf2c9f;', res, accounts);

      const balance = await api.rpc.balances.usableBalance(0, signer);

      setBalance(balance.usableBalance.toString());
      setApi(api);
    })();
  }, []);

  return (
    <div className="App">
      <div className="indicator">{status}</div>
      <form className="form">
        <label>Recipient</label>
        <input
          type="text"
          placeholder="Type the recipient account"
          onChange={(event) => {
            const value = event.target.value;

            setRecipient(value);
          }}
        />
        <p>RING balance: {String(Number(balance) / Math.pow(10, 9))}</p>

        <label>Amount</label>
        <input
          type="number"
          placeholder="Type RING amount"
          onChange={(event) => {
            const value = event.target.value;

            setAmount(value);
          }}
        />
      </form>

      <button
        onClick={async () => {
          const wei = amount + '0'.padEnd(9, '0');
          const extrinsic = api.tx.balances.transfer(recipient, wei);
          const injector = await web3FromAddress(signer);

          api.setSigner(injector.signer);

          extrinsic.signAndSend(signer, (result) => {
            if (!result || !result.status) {
              return;
            }

            const { error, finalized } = result.status.toJSON();

            if (result.status.isBroadcast) {
              setStatus('broadcast');
            }

            if (result.status.isReady) {
              setStatus('queued');
            }

            if (result.status.isInBlock) {
              setStatus('inblock');
            }

            if (result.status.isFinalized) {
              setStatus('finalized');
              setHash(finalized);

              setTimeout(() => {
                setStatus('pending');
              }, 3000);
            }

            if (result.isError) {
              setStatus('error');
              console.error('------>', error);
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
