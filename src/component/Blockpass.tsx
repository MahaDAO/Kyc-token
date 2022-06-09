
import React, { Component } from 'react';

class Blockpass extends Component {

    componentDidMount() {    
        this.loadBlockpassWidget()
    }
    
    loadBlockpassWidget = () => {
        const blockpass = new (window as any).BlockpassKYCConnect(
            'scallop_test_675a6', // service client_id from the admin console
            {
                refId: "616c412fd22ae2001ac00d2d", // assign the local user_id of the connected user
            }
        )

        blockpass.startKYCConnect()
    
        blockpass.on('KYCConnectSuccess', () => {
            //add code that will trigger when data have been sent.
        })
    }

    render() {
        return (
            <div className="main">
                <h1>DAMM</h1>
                <input></input>
                <button id="blockpass-kyc-connect">
                    Verify with Blockpass
                </button>
            </div>
        );
    }
}


export default Blockpass;