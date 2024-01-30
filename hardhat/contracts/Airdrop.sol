// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable {
    IERC20 public token = IERC20(0xFa60D973F7642B748046464e165A65B7323b0DEE);

    constructor() Ownable(msg.sender) {}

    function releaseSingle(
        address _address,
        uint256 _amount
    ) public onlyOwner returns (bool) {
        token.transferFrom(msg.sender, _address, _amount);

        return true;
    }

    function releaseMultiple(
        address[] memory _address,
        uint256[] memory _amounts
    ) public onlyOwner returns (bool) {
        require(
            _address.length == _amounts.length,
            "Airdrop: recipients and amounts length mismatch"
        );

        for (uint256 i = 0; i < _amounts.length; i++) {
            token.transferFrom(msg.sender, _address[i], _amounts[i]);
        }

        return true;
    }
}
