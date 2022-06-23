// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract ERC777AT is ERC777 {
    constructor(
        address[] memory defaultOperators
    ) ERC777("AsemToken", "AT", defaultOperators) {
        _mint(msg.sender, 10000*10**18, "", "");
    }
}