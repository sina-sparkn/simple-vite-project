import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/newContract.json";

const getEthereumObject = () => window.ethereum;

//! Find the wallet function
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

//! APP
function App() {
  const [currnetAccount, setCurrentAccount] = useState("");
  const [miningstatus, setminingstatus] = useState(null);
  const [allSalams, setAllSalams] = useState([]);
  const [theMessage, settheMessage] = useState("");

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

  const contractAddress = "0xa4578DBB1528BacDeb2BE49206de0693bb6C32A1";
  const contractABI = abi.abi;

  //!Salam function
  const Salam = async () => {
    try {
      setminingstatus(1);
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

        const saySalam = await newContract.Salam(theMessage);
        console.log("mining...", saySalam);
        await saySalam.wait();
        console.log("mined--", saySalam.hash);
        count = await newContract.getTotalSalams();
        console.log("Retrieved total Salam count...", count.toNumber());

        setminingstatus(null);
      } else {
        console.log("ethereum object does not found!");
      }
    } catch (error) {
      console.error(error);
      setminingstatus(null);
    }
  };

  //!get all information from the contract struct and add them as an array to the allSalams useState
  async function GetSalamkona() {
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

        const Salams = await newContract.getAllSalamkona();

        let SalamkonhaList = [];

        Salams.forEach((salam) => {
          SalamkonhaList.unshift({
            address: salam.salamkon,
            message: salam.message,
            timeStamp: new Date(salam.timestamp * 1000),
            thisUserSalams: salam.numberOfSalams,
          });
        });

        setAllSalams(SalamkonhaList);
      } else {
        console.error("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  //!useEffect
  useEffect(() => {
    const getAccount = async () => {
      const account = await findMetaMaskAccounts();
      if (account !== null) {
        setCurrentAccount(account);
      }
    };
    getAccount().catch(console.error);
    GetSalamkona().catch(console.error);
  }, []);

  return (
    <div>
      <h2>👋 Welcome Outsider</h2>
      <h2>Come and Say Salam to me</h2>
      <br />
      <h2>your message : </h2>
      <input
        type="text"
        onChange={(event) => settheMessage(event.target.value)}
      />
      <br />
      <br />
      {!miningstatus ? (
        <button onClick={Salam}>Say Salam to me</button>
      ) : (
        <button>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </button>
      )}
      <br />
      <br />
      {!currnetAccount ? (
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      ) : (
        <button>{currnetAccount}</button>
      )}
      <br />
      <br />

      {allSalams.map((salam, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: "purple",
              marginBottom: "25px",
              borderRadius: "15px",
              padding: "10px",
            }}
          >
            <div>address : {salam.address}</div>
            <div>message : {salam.message}</div>
            <div>
              number of this address Salams : {salam.thisUserSalams.toString()}
            </div>
            <div>timestamp : {salam.timeStamp.toString()}</div>

            <br />
          </div>
        );
      })}
    </div>
  );
}

export default App;
