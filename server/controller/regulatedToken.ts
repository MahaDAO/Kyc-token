const dotenv = require("dotenv");

import { mintToken } from './web3/regulatedToken'

dotenv.config();

export const mintCoin = async (req: any, res: any) => {
    let address = req.body.address
    let coin = req.body.coin
    let amount = req.body.amount

    if (!address) {
        res.send({ error: "Please Add The Address Of THE Spender" })
    }
    
    if (!coin) {
        res.send({ error: "Please Select A Coin 'GBP/ EUR/ USD'" })
    }

    if (!amount) {
        res.send({ error: "Please Input The Amount To Mint" })
    }

    let response = await mintToken(coin, address, amount)

    res.send({ message: response })
}