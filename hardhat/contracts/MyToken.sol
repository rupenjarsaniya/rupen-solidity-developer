// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("My token", "MT") Ownable(msg.sender) {
        _mint(msg.sender, 5 * 10 ** decimals());
    }

    function transferTokenOwnership(address newOwner) public onlyOwner {
        transfer(newOwner, balanceOf(owner()));
    }
}
