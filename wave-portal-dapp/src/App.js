import * as React from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const wave = () => {};

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hello!</div>

        <div className="bio">
          I'm Ryan, and this is my first dapp. Connect your Ethereum wallet and
          wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave
        </button>
      </div>
    </div>
  );
}
