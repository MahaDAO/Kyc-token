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
const kycWithSigner = kycContract.connect(signer)

const sclpContract = new ethers.Contract(sclNetwork.address, SclpAbi.abi, provider)

export const addUser = async (walletAddress: any, name: any, dob: any, recordId: any) => {
    const transaction = await kycWithSigner.uploadKycDocuments(
        walletAddress,
        name,
        dob,
        recordId
    )

    const receipt = await transaction.wait()
    return receipt.transactionHash
}

export const setKYCComleted = async (walletAddress: any, teir: any) => {
    const transaction = await kycWithSigner.setKYCComleted(
        walletAddress,
        teir
    )

    const receipt = await transaction.wait()
    return receipt.transactionHash
}

export const updateKYCTeir = async (walletAddress: any, teir: any) => {
    const transaction = await kycWithSigner.updateKycTeir(
        walletAddress,
        teir
    )

    const receipt = await transaction.wait()
    return receipt.transactionHash
}

export const revokeKyc = async (walletAddress: any) => {
    const transaction = await kycWithSigner.setKYCRevoked(
        walletAddress
    )

    const receipt = await transaction.wait()
    return receipt.transactionHash
}
