const dotenv = require("dotenv");
import { ethers } from "ethers";

import KycAbi from '../../abis/KycContract.json'
import TokenABI from '../../abis/ERC20Mock.json'

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider('http://scallop.rpc.devicoin.org/')
//const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545/')
const signer = new ethers.Wallet(`${process.env.SUPER_ACCOUNT}`, provider);

const kycNetwork = KycAbi.networks[9001]

const tokens = {
    "EUR" : "0x5E944AEc68012922BcfB9Fc9eAcb3191b8Aae17b",
    "GBP" : "0x4977839d54Ab4AAC32D198a562898603456086Bb",
    "USD" : "0x59f8718E4edeF887D242A5F53526a1eC2bDC8944"
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
