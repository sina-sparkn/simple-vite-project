import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/newContract.json";
import "../dist/output.css";

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

  const contractAddress = "0x8EFb69454B42FfA56aC499936E953C18E7983d64";
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

        const saySalam = await newContract.Salam(theMessage, {
          gasLimit: 300000,
        });
        const seed = await newContract.gettheSeed();
        console.log(`the seed is ${seed}`);

        console.log("gasLimit", saySalam.gasLimit.toNumber());
        console.log("gasPrice", saySalam.gasPrice.toNumber());
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

    //! from here !

    const onNewSalam = (salamkon, message, numberOfSalams, timestamp) => {
      GetSalamkona((prev) => [
        {
          ...prev,
          address: salamkon,
          message: message,
          thisUserSalams: numberOfSalams,
          timestamp: new Date(timestamp * 1000),
        },
      ]);
    };

    let newContract;
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      newContract = new ethers.Contract(contractAddress, contractABI, signer);
      newContract.on("newSalam", onNewSalam);
    } else {
      console.error("ethereum object does not found!");
    }

    return () => {
      if (newContract) {
        newContract.off("newSalam", onNewSalam);
      }
    };

    //! all the way down over here !
  }, []);

  return (
    <div className="flex p-20 bg-zinc-900 text-gray-100 gap-5 text-xl Spline_Sans_Mono_700 w-full h-full">
      <section className="w-1/2 flex flex-col justify-center items-center gap-10">
        <div className="text-3xl flex flex-col gap-3">
          <h2 className="">Hi my beautiful Friend</h2>
          <h2>Come and Say Salam to me</h2>
        </div>
        <div className="flex flex-col gap-3 mt-7">
          <h2>your message to me : </h2>
          <input
            type="text"
            onChange={(event) => settheMessage(event.target.value)}
            className="outline-none bg-blue-600/30 transition-all text-white p-3 px-5 rounded-lg"
          />
        </div>

        {!miningstatus ? (
          <button
            onClick={Salam}
            className="bg-blue-600 p-3 px-5 rounded-lg Spline_Sans_Mono_600 transition-all hover:bg-blue-500"
          >
            Say Salam to me
          </button>
        ) : (
          <span className="loader text-white"></span>
        )}

        {!currnetAccount && (
          <button
            className="bg-blue-600 transition-all p-3 px-5 rounded-lg Spline_Sans_Mono_600 hover:bg-blue-500"
            onClick={connectToMetaMask}
          >
            Connect to MetaMask
          </button>
        )}
      </section>

      <section className="flex flex-col gap-10 w-1/2 overflow-y-scroll pr-10">
        <div>Salamcona : </div>

        {!currnetAccount && (
          <div>
            <strong>Connect to Metamask with goerli testnet</strong>
          </div>
        )}
        {allSalams.map((salam, index) => {
          return (
            <div
              key={index}
              className="bg-blue-500/70 p-5 Spline_Sans_Mono_500 rounded-lg flex flex-col gap-5"
            >
              <div>
                <strong>Address :</strong> {salam.address}
              </div>
              <div>
                <strong>Message :</strong> {salam.message}
              </div>
              <div>
                <strong>This user Salam Counter : </strong>
                {salam.thisUserSalams.toString()}
              </div>
              <div>
                <strong>Timestamp :</strong> {salam.timeStamp.toString()}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
