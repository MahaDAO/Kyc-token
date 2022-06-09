const dotenv = require("dotenv");
import { ethers } from "ethers";

import KycAbi from '../../abis/KycContract.json'
import SclpAbi from '../../abis/ERC20Mock.json'

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/e95c6744ded94bbe81e881b8ca002ce7')
const signer = new ethers.Wallet(`${process.env.METAMASK_WALLET_SECRET}`, provider);

const kycNetwork = KycAbi.networks[4]
const sclNetwork = SclpAbi.networks[4]

const kycContract = new ethers.Contract(kycNetwork.address, KycAbi.abi, provider)
const sclpContract = new ethers.Contract(sclNetwork.address, SclpAbi.abi, provider)

const addUser = async () => {
    const kycWithSigner = kycContract.connect(signer)

    kycWithSigner.uploadKycDocuments(
        "Sagar",
        "Sagar",
        "Sag"
    )
}

addUser()