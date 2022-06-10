const timestamps = require('mongoose-timestamp')
const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const model = mongoose.model;
const Document = mongoose.Document;

export interface IUser {
    refId : string,
    recordId : string,
    blockPassID : string,
    familyName: string,
    email: string,
    givenName: string,
    dob: string,
    drivingLicenseCountry: string,
    status: string,
    teir: number,
    approved: boolean,
    walletAddress: string
}

const user = new Schema({
    refId : String,
    recordId : String,
    blockPassID : String,
    familyName: String,
    email: String,
    givenName: String,
    dob: String,
    drivingLicenseCountry: String,
    status: String,
    teir: Number,
    approved: Boolean,
    walletAddress: String
})

user.plugin(timestamps)

export type IUserModel = IUser & Document
export const User = model('User', user)