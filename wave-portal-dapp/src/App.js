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
  // set contract address
  const contractAddress = "0xAB8B069383B866088301F824979a75685110e42d";
  // set contract ABI
  const contractABI = abi.abi;

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
        const waveTxn = await wavePortalContract.wave();
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

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hello!</div>

        <div className="bio">
          I'm Ryan, and this is my first dapp. Connect your Ethereum wallet and
          wave at me!
        </div>
        {accountAddress && (
          <div className="bio">Connected Wallet: {accountAddress}</div>
        )}
        {accountBalance && (
          <div className="bio">
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
      </div>
    </div>
  );
}
