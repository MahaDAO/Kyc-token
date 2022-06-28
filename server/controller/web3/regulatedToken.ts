const dotenv = require("dotenv");
import { ethers } from "ethers";

import KycAbi from '../../abis/KycContract.json'
import TokenABI from '../../abis/ERC20Mock.json'

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider('http://scallop.rpc.devicoin.org/')
const signer = new ethers.Wallet(`${process.env.SUPER_ACCOUNT}`, provider);

const kycNetwork = KycAbi.networks[9000]

const tokens = {
    "EUR" : "0x458263088BAfC21246f490BcAf4013f3F9feC530",
    "GBP" : "0xDD8E1F429C92368b8BA0e53fC0f697b9c2414212",
    "USD" : "0x717F73f3637652fb2f692368AEa5Eab94fF2686e"
}

const kycContract = new ethers.Contract(kycNetwork.address, KycAbi.abi, provider)
const kycWithSigner = kycContract.connect(signer)

const euroContract = new ethers.Contract(tokens.EUR, TokenABI.abi, provider)
const euroContractSigner = euroContract.connect(signer)

const gbpContract = new ethers.Contract(tokens.GBP, TokenABI.abi, provider)
const gbpContractSigner = gbpContract.connect(signer)

const usdContract = new ethers.Contract(tokens.USD, TokenABI.abi, provider)
const usdContractSigner = usdContract.connect(signer)

export const mintToken = async (coinparam: any, address: any, amount: any) => {
    let contract:any, contractSigner:any
    let coin = String(coinparam)
    
    if (coin === "EUR") {
        contract = euroContract
        contractSigner = euroContractSigner
    } else if (coin === "GBP") {
        contract = gbpContract
        contractSigner = gbpContractSigner
    } else if (coin === "USD") {
        contract = usdContract;
        contractSigner = usdContractSigner
    } 

    let mintingAmount = ethers.utils.parseUnits(String(amount), 18);
    
    const transaction = await contractSigner.mint(
        address,
        String(mintingAmount)
    )
    
    const receipt = await transaction.wait()
    return await `Tokens minting in progress:- ${receipt.transactionHash}`//${transaction.hash}`
}
