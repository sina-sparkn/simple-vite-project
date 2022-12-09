import { useEffect, useState } from "react";
import "./App.css";

const getEthereumObject = () => window.ethereum;

async function findMetaMaskAccounts() {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.error("Install MetaMask!");
      return null;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

function App() {
  const [currnetAccount, setCurrentAccount] = useState("");

  {
    /* ? what does this function do ? 👇*/
  }

  const connectToMetaMask = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`connected to account : ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getAccount = async () => {
      const account = await findMetaMaskAccounts();
      if (account !== null) {
        setCurrentAccount(account);
      }
    };

    // getAccount().catch(console.error);
    getAccount();
  }, []);

  return (
    <div>
      <h2>👋 Welcome Outsider</h2>
      <h2>Come and Say Salam to me</h2>
      <br />
      <button onClick={null}>Say Salam to me</button>
      <br />
      <br />
      {!currnetAccount ? (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      ) : (
        <button>{currnetAccount}</button>
      )}

      {/* {!currnetAccount && (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      )} */}
    </div>
  );
}

export default App;
