// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {
    uint256 public kycApprovedUser;
    
    enum Status { pending, inprogress, approved, rejected }

    struct KYC {
        Status status;
        bool approval;
        uint256 teir;
    }

    struct UserInfo {
        address walletAddress;
        string name;
        string residentialAddress;
        string kycRegisterationId;
        bool updation;
    }

    mapping( address => KYC ) public allowed;
    mapping( address => UserInfo ) public userDetails;

    // ============= Admin Functionalities  =========================
    function setKYCComleted(address user, uint256 teir) public onlyOwner {
        require(!allowed[user].approval, "User already approved");

        kycApprovedUser = kycApprovedUser + 1; 
        allowed[user] = KYC(Status.approved, true, teir);
    }

    function updateKycTeir(address user, uint256 teir) public onlyOwner {
        KYC memory kyc = allowed[user];
        kyc.teir = teir;
        allowed[user] = kyc;
    }

    function setKYCRevoked(address user) public onlyOwner {
        require(allowed[user].approval, "User not yet approved");

        kycApprovedUser = kycApprovedUser - 1;
        allowed[user] = KYC(Status.rejected, false, 0);
    }

    // ============= User Functionalists ==============================

    function isAllowed(address user) public view returns (bool, uint256) {
        return (allowed[user].approval, allowed[user].teir);
    }

    function uploadKycDocuments(
        string memory name,
        string memory residentialAddress,
        string memory kycRegisterationId
    ) public {
        if(userDetails[msg.sender].updation) {
            UserInfo memory userInfo = userDetails[msg.sender];
            
            userInfo.name = name;
            userInfo.residentialAddress = residentialAddress;
            userInfo.kycRegisterationId = kycRegisterationId;

            userDetails[msg.sender] = userInfo;
        } else {
            userDetails[msg.sender] = UserInfo(
                msg.sender,
                name,
                residentialAddress,
                kycRegisterationId,
                true
            );
        }
    }
}