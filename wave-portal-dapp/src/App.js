import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import "./App.css";
const provider = new ethers.providers.Web3Provider(window.ethereum);

export default function App() {
  // state to store user's public wallet and data
  const [currentWallet, setCurrentWallet] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  // store waves
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");
  // set contract address
  const contractAddress = "0x4fc5e5CbeF16076aCD9292f6b2cE751793fE1a9c";
  // set contract ABI
  const contractABI = abi.abi;

  // function to get waves from smart contract
  const getAll = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        // call getAll function from contract
        const waves = await wavePortalContract.getAll();

        // grab address, timestamp, and message from user tx
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
        // store data in state
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to check if user has metamask wallet
  const checkWallet = async () => {
    try {
      //make sure browser has access to ethereum window
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Install Metamask and create a wallet!");
      } else {
        console.log("Ethereum window connected", ethereum);
      }

      // check if we can access user wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (!accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found authorized account:", account);
        setCurrentWallet(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // connect wallet function
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Install Metamask and create a wallet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // get account balance
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      setAccountBalance(bal);

      console.log("Connected", accounts[0]);
      setCurrentWallet(accounts[0]);
      setAccountAddress(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // calling contract function on frontend
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotal();
        console.log("Total wave count: ", count.toNumber());

        // execute functions from contract
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300000,
        });
        console.log("Mining tx...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Tx mined: ", waveTxn.hash);

        count = await wavePortalContract.getTotal();
        console.log("Total wave count: ", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // run function on page load
  useEffect(() => {
    checkWallet();
  }, []);

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hello!</div>

        <div className="subtitle">
          I'm Ryan, and this is the Wave Portal! Connect your Ethereum wallet,
          write your message, and wave!
        </div>
        {accountAddress && (
          <div className="subtitle">Connected Wallet: {accountAddress}</div>
        )}
        {accountBalance && (
          <div className="subtitle">
            Account Balance: {parseFloat(accountBalance).toFixed(3)} ETH
          </div>
        )}

        <button className="button" onClick={wave}>
          Wave
        </button>

        {/*
         * If there is no currentAccount render this button
         */}
        {!currentWallet && (
          <button className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {currentWallet && (
          <textarea
            className="textbox"
            name="messageArea"
            placeholder="Type message here..."
            type="text"
            id="message"
            borderRadius="4px"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        )}

        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              className="messageBox"
              style={{
                backgroundColor: "white",
                marginTop: "16px",
                padding: "8px",
                color: "black",
                borderRadius: "4px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
