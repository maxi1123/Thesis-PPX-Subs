// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract SimpleToken is ERC777 {
    address payable owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Callable by contract owner only!");
        _;
    }

    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators,
        address payable owner_
    ) ERC777("SimpleToken", "SIM", defaultOperators) {
        _mint(msg.sender, initialSupply, "", "");
        owner = owner_;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}
