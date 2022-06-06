pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IKyc} from "./interface/IKyc.sol";

contract ERC20Mock is ERC20,Ownable {
    using SafeMath for uint256;

    IKyc public kycContract;
    mapping(address => uint256) private _balances;

    struct transtions {
        address walletAddress;
        uint256 amount;
        uint256 timestamp; 
    }

    mapping (address => transtions) public usersTransaction;

    constructor (
        string memory name,
        string memory symbol,
        address kyc
    ) payable ERC20(name, symbol) {
        kycContract = IKyc(kyc);
        _mint(msg.sender, 100**18);
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

    function checkSpending(uint256 teir, address from, address to, uint256 amount) internal {
        require(teir > 0, "No teir for the user");

        if (teir == 1 && amount > 1000 ** 18)
            revert("Above Limit of teir 1");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        if(usersTransaction[msg.sender].walletAddress == msg.sender){
            (bool approval, uint256 teir) = kycContract.isAllowed(msg.sender);
            if (approval) {
               
            } else {
                revert("Not Known User");
            }
        } else {
            
        }
    }

    function approveInternal(address owner, address spender, uint256 value) public {
        _approve(owner, spender, value);
    }
}