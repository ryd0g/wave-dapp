// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract WavePortal {
    /* variable for wave count*/
    uint256 total;
    /* create event for wave */
    event newWave(address indexed from, uint256 timestamp, string message);
    /* data struct for wave */
    struct Wave {
        address waver; // address of user sending wave
        string message; // message sent by user
        uint256 timestamp; // timestamp user sent message
    }

    /* storing array of waves */
    Wave[] waves;

    constructor() {
        console.log("This is a test smart contract");
    }

    /* function for waving */
    function wave(string memory _message) public {
        total += 1;
        console.log("%s waved!", msg.sender, _message);
        // storing wave data in array
        waves.push(Wave(msg.sender, _message, block.timestamp));
        // emit event for message sent
        emit newWave(msg.sender, block.timestamp, _message);
    }

    /* function to return waves array */
    function getAll() public view returns (Wave[] memory) {
        return waves;
    } 

    /* function to get total amount of waves */
    function getTotal() public view returns (uint256) {
        console.log("%d people have waved!", total);
        return total;
    }
}