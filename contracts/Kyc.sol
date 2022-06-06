// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {
    uint256 public kycApprovedUser;
    uint256 public usersApprovalCount;
    
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
        string documentsLink;
        string bankStatementsLink;
        bool updation;
    }

    mapping( address => KYC ) public allowed;
    mapping( address => UserInfo ) public userDetails;

    function isAllowed(address user) public view returns (bool) {
        return allowed[user].approval;
    }

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

    function uploadKycDocuments(
        string memory name,
        string memory residentialAddress,
        string memory documentsLink,
        string memory bankStatementsLink
    ) public {
        if(userDetails[msg.sender].updation) {
            UserInfo memory userInfo = userDetails[msg.sender];
            
            userInfo.name = name;
            userInfo.residentialAddress = residentialAddress;
            userInfo.documentsLink = documentsLink;
            userInfo.bankStatementsLink = bankStatementsLink;

            userDetails[msg.sender] = userInfo;
        } else {
            userDetails[msg.sender] = UserInfo(
                msg.sender,
                name,
                residentialAddress,
                documentsLink,
                bankStatementsLink,
                true
            );
        }
    }
}