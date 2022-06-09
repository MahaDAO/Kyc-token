const dotenv = require("dotenv");
const rp = require('request-promise');

import { addUser } from './web3/blockpass'

dotenv.config();

const request = async (method: any, recordId: any) => {
    const options = {
        url: `https://kyc.blockpass.org/kyc/1.0/connect/${process.env.CLIENT_ID}/recordId/${recordId}`,
        method: method,
        headers: {
            'Authorization': `${process.env.BLOCKPASS_KEY}`
        }
    }

    return await rp(options);
}

export const getWalletAddress = async (req: any, res: any) => {
    let address = req.body.address

    if (!address){
        res.send({ error: 'No Wallet Address'})
    } else {
        res.send({ address: address })
    }
}

export const webhook = async (req :any, res: any) => {
    let body = req.body
    let event = body.event    
    const fetchedData = await request('GET', body.recordId)
    const parsedData = JSON.parse(fetchedData)
    const data = parsedData.data
    

    let refId = data.refId
    let recordId = data.recordId
    let blockPassID = data.blockPassID
    let familyName = data.identities.family_name
    let email = data.identities.email
    let givenName = data.identities.given_name.value
    let dob = data.identities.dob.value
    let drivingLicenseCountry = data.identities.driving_license_issuing_country 

    console.log({
        refId : refId,
        recordId : recordId,
        blockPassID : blockPassID,
        familyName: familyName,
        email: email,
        givenName: givenName,
        dob: dob,
        drivingLicenseCountry: drivingLicenseCountry
    });
    
    if (event === 'user.created') {
        let contractUpdation = await addUser(
            '0x775C72FB1C28c46F5E9976FFa08F348298fBCEC0',
            givenName,
            dob,
            recordId
        )
        
        // database checkup to keep reordId as one
        console.log('blockchain kyc transaction for user insertion:', contractUpdation);
    }

    if (event === 'review.approved') {

    }
    
    res.send({ sucess: true })
}