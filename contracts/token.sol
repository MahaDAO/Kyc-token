// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IKyc} from "./interface/IKyc.sol";

contract ERC20Mock is ERC20, Ownable {
    using SafeMath for uint256;

    IKyc public kycContract;
    struct Transactions {
        address walletAddress;
        uint256 amount;
        uint256 timestamp; 
    }

    mapping (address => Transactions) public usersTransaction;

    constructor (
        string memory name,
        string memory symbol,
        address kyc
    ) payable ERC20(name, symbol) {
        kycContract = IKyc(kyc);
        mint(msg.sender, 100 ether);
    }
    
    // ================ Admin Functionality ==========================
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
    
    function burn(address account, uint256 amount) public onlyOwner{ 
        _burn(account, amount);
    }

    function setKycContract(address kyc) public onlyOwner {
        kycContract = IKyc(kyc);
    }
    // ================ User Functionality ==========================

    function amountTransferable(uint256 teir, address from, address to, uint256 amount) public view returns (uint256){
        require(teir > 0, "No teir for the user");

        if (teir == 1 && amount > 1000 ether)
            revert("Above Limit of teir 1");

        if (teir == 2 && amount > 2000 ether)
            revert("Above Limit of teir 2");

        if (teir == 3 && amount > 3000 ether)
            revert("Above Limit of teir 3");

        Transactions memory transactions = usersTransaction[from];

        if(teir == 1) {
            if(block.timestamp - transactions.timestamp > 1 days){
                return 1000 ether;
            } else {
                return (1000 ether) - transactions.amount;
            }
        }

        if(teir == 2) {
            if(block.timestamp - transactions.timestamp > 1 days){
                return 2000 ether;
            } else {
                return (2000 ether) - transactions.amount;
            }
        }

        if(teir == 3) {
            if(block.timestamp - transactions.timestamp > 1 days){
                return 3000 ether;
            } else {
                return (3000 ether) - transactions.amount;
            }
        }
    }

    function _transfer(address from, address to, uint256 amount) internal override{
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);
        Transactions memory transactions = usersTransaction[from];

        if(transactions.walletAddress == from){
            (bool approval, uint256 teir) = kycContract.isAllowed(from);
            if (approval) {
                uint256 amountSpendable = amountTransferable(teir, from, to, amount);

                if (amountSpendable >= amount) {
                    super._transfer(from, to, amount);
                } else {
                    revert("Transaction limit reached for user");
                }

                transactions.amount = transactions.amount + amount;
                transactions.timestamp = block.timestamp;
                usersTransaction[from] = transactions;
            } else {
                revert("Not Known User");
            }
        } else {
            (bool approval, uint256 teir) = kycContract.isAllowed(from);
            if (approval) {
                uint256 amountSpendable = amountTransferable(teir, from, to, amount);

                if (amountSpendable >= amount) {
                    super._transfer(from, to, amount);
                } else {
                    revert("Transaction limit reached for user");
                }

                usersTransaction[from] = Transactions(
                    from,
                    amount,
                    block.timestamp
                );
            } else {
                revert("Not Known User");
            }
        }
    }

    function approveInternal(address owner, address spender, uint256 value) public {
        _approve(owner, spender, value);
    }

    // ========================= Test Function Have To Be Removed Later ===================
    function checkStatus(address from) public view returns (bool, uint256){
        (bool approval, uint256 teir) = kycContract.isAllowed(from);

        return (approval, teir);
    }
}