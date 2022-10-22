import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import type { NextPage } from "next";
import { useState } from "react";
import { injected } from "../components/Connectors";

const Home: NextPage = () => {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
  const [error, setError] = useState<any>();
  const [txs, setTxs] = useState<any[]>([]);

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  const startPayment = async ({ ether, addr }: any) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      console.log("check 01");
      await window.ethereum.send("eth_requestAccounts");

      const signer = library.getSigner();
      console.log("check 02");
      const tx = signer
        .sendTransaction({
          from: account,
          to: addr,
          gasLimit: BigNumber.from("21000").toHexString(),
          value: parseUnits(ether, 18),
        })
        .then((response: { hash: any }) => {
          console.log({ ether, addr });
          return response.hash;
        })
        .catch((error: { code: number }) => {
          if (error?.code === 4001) {
            throw new Error("Transaction rejected.");
          } else {
            console.error(`Demo Trans Failed`, error, addr, ether);

            throw new Error(`Demo Trans failed`);
          }
        });
      console.log("tx", tx);
      setTxs([tx]);
      console.log("check 03");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError("" as any);
    await startPayment({
      ether: data.get("ether"),
      addr: data.get("addr"),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={connect}
        className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
      >
        Connect to MetaMask
      </button>
      {active ? (
        <span>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span>Not connected</span>
      )}
      <button
        onClick={disconnect}
        className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
      >
        Disconnect
      </button>

      <form onSubmit={handleSubmit}>
        <div className="main-div">
          <main>
            <h1>Send ETH payment</h1>
            <div className="main-div">
              <div>
                <input
                  type="text"
                  name="addr"
                  placeholder="Recipient Address"
                />
              </div>
              <div>
                <input name="ether" type="text" placeholder="Amount in ETH" />
              </div>
            </div>
          </main>
          <footer className="main-div">
            <button type="submit">Pay now</button>
            {error && console.log(error)}
            {txs && console.log(txs)}
          </footer>
        </div>
      </form>
    </div>
  );
};

export default Home;
