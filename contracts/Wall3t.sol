pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Wall3t {
    
    mapping(address => uint) Wallets;

    function withdrawMoney(address payable _to, uint _amount) external {
        require(_amount <= Wallets[msg.sender], "Not enought funds");
        Wallets[msg.sender] -= _amount;
        _to.transfer(_amount);

    }

    function getBalance() external view returns(uint) {
        return Wallets[msg.sender];
    }

    receive() external payable {
        Wallets[msg.sender] += msg.value;
    }

    fallback() external payable {

    }
}
