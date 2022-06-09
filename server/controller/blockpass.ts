const dotenv = require("dotenv");
const rp = require('request-promise');

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

export const webhook = async (req :any, res: any) => {
    let body = req.body
    let event = body.event

    const fetchedData = await request('GET', body.recordId)
    const data = fetchedData.data

    let refId = data.refId
    let recordId = data.recordId
    let blockPassID = data.blockPassID
    let familyName = data.identities.family_name
    let email = data.identities.email
    let givenName = data.identities.given_name
    let dob = data.identities.dob
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
    
    res.send({ sucess: true })
}