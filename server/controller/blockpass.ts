const dotenv = require("dotenv");
const rp = require('request-promise');

import { addUser, setKYCComleted } from './web3/blockpass'
import { User } from '../database/models/user'

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
    let name = req.body.name
    let email = req.body.email

    const checkUser = await User.findOne({ address: address })
    
    if (!address){
        res.send({ error: 'No Wallet Address'})
    } else {
        if(checkUser) {
            checkUser.set('familyName', name)
            checkUser.set('email', email)
            checkUser.set('givenName', name)

            await checkUser.save()
        } else {
            const newUser = new User({
                givenName: name,
                familyName: name,
                email: email,
                walletAddress: address
            })

            await newUser.save()
        }   

        res.send({ address: address })
    }
}

export const webhook = async (req :any, res: any) => {
    let body = req.body
    let event = body.event    
    
    const fetchedData = await request('GET', body.recordId)
    const parsedData = JSON.parse(fetchedData)
    const data = parsedData.data
    
    console.log(body);
    console.log('========================================');
    
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
        const checkUser = await User.findOne({ recordId: recordId})

        if(!checkUser) {
            
            const getReactUser = await User.findOne({
                email: email.value
            })

            if (getReactUser) {
                getReactUser.set('refId', refId)
                getReactUser.set('recordId', recordId)
                getReactUser.set('blockPassID', blockPassID)
                getReactUser.set('dob', dob)
                getReactUser.set('drivingLicenseCountry', drivingLicenseCountry.value)
                getReactUser.set('teir', 0)
                getReactUser.set('approved', false)
                getReactUser.set('status', 'waiting')

                await getReactUser.save()
                
                let contractUpdation = await addUser(
                    '0x775C72FB1C28c46F5E9976FFa08F348298fBCEC0',
                    givenName,
                    dob,
                    recordId
                )
                
                // database checkup to keep reordId as one
                console.log('blockchain kyc transaction for user insertion:', contractUpdation);
            } else {
                const newUser = new User({
                    refId : refId,
                    recordId : recordId,
                    blockPassID : blockPassID,
                    familyName: familyName.value,
                    email: email.value,
                    givenName: givenName,
                    dob: dob,
                    drivingLicenseCountry: drivingLicenseCountry.value,
                    teir: 0,
                    approved: false,
                    status: 'waiting'
                })
    
                await newUser.save()
    
                let contractUpdation = await addUser(
                    '0x775C72FB1C28c46F5E9976FFa08F348298fBCEC0',
                    givenName,
                    dob,
                    recordId
                )
                
                // database checkup to keep reordId as one
                console.log('blockchain kyc transaction for user insertion:', contractUpdation);
            }
        }
    }

    if (event === 'user.inReview') {
        const checkUser = await User.findOne({ recordId: recordId})

        if (checkUser) {
            checkUser.set('status', 'inreview')

            await checkUser.save()
        }
    }

    if (event === 'review.approved') {
        const checkUser = await User.findOne({ recordId: recordId})

        if (checkUser) {
            checkUser.set('teir', 1)
            checkUser.set('approved', true)
            checkUser.set('status', 'reviewed')

            await checkUser.save()

            let contractUpdation = await setKYCComleted(
                checkUser.walletAddress,
                1
            )
            
            // database checkup to keep reordId as one
            console.log('blockchain kyc transaction for kyc updation:', contractUpdation);
        }
    }
    
    res.send({ sucess: true })
}