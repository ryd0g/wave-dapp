import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  // state to store user's public wallet
  const [currentWallet, setCurrentWallet] = useState("");
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

      console.log("Connected", accounts[0]);
      setCurrentWallet(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  // run function on page load
  useEffect(() => {
    checkWallet();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hello!</div>

        <div className="bio">
          I'm Ryan, and this is my first dapp. Connect your Ethereum wallet and
          wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave
        </button>

        {/*
         * If there is no currentAccount render this button
         */}
        {!currentWallet && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
