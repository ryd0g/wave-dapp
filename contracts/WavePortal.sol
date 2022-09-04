// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract WavePortal {
    uint256 total;

    constructor() {
        console.log("This is a test smart contract");
    }

    function wave() public {
        total += 1;
        console.log("%s waved!", msg.sender);
    }

    function getTotal() public view returns (uint256) {
        console.log("%d people have waved!", total);
        return total;
    }
}