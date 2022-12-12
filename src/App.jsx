import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/newContract.json";

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
  const [miningstatus, setminingstatus] = useState(null);

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

  const Salam = async () => {
    const contractAddress = "0x58AB0e6c396071c5bf42496F8D0A341EAaCd520e";
    const contractABI = abi.abi;
    setminingstatus(1);

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const newContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await newContract.getTotalSalams();
        console.log("Retrieved total Salam count...", count.toNumber());

        const saySalam = await newContract.Salam("ali");
        console.log("mining...", saySalam);
        await saySalam.wait();
        console.log("mined--", saySalam.hash);

        setminingstatus(null);

        count = await newContract.getTotalSalams();
        console.log("Retrieved total Salam count...", count.toNumber());
      } else {
        console.log("ethereum object does not found!");
      }
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

    getAccount().catch(console.error);
  }, []);

  return (
    <div>
      <h2>👋 Welcome Outsider</h2>
      <h2>Come and Say Salam to me</h2>
      <br />
      {!miningstatus ? (
        <button onClick={Salam}>Say Salam to me</button>
      ) : (
        <button onClick={Salam}>LOADING ...</button>
      )}
      <br />
      <br />
      {!currnetAccount ? (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      ) : (
        <button>{currnetAccount}</button>
      )}
    </div>
  );
}

export default App;
