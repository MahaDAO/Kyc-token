
import React, { Component } from 'react';

class Blockpass extends React.Component<{},any>{
    constructor(props: any) {
        super(props)

        this.state = {
            walletAddress: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

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

    async handleSubmit(event: any) {
        event.preventDefault()
        console.log(this.state.walletAddress);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: this.state.walletAddress })
        };
        
        fetch('http://localhost:3001/api/address', requestOptions)
            .then(response => response.json())
    }

    async StartKyc(props:any) {
        
    }

    render() {
        return (
            <div className="main">
                <h1>DAMM</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        ENTER WALLETADDRESS
                    </label>
                    <br/>
                    <br/>
                    <input 
                        className='walletAddress'
                        type="text"
                        value={this.state.walletAddress}
                        onChange={event => this.setState({ walletAddress: event.target.value })}
                    />
                    <br/>
                    <br/>
                    <button id="blockpass-kyc-connect" disabled={this.state.walletAddress === ''}>
                        Verify with Blockpass
                    </button>
                </form>
            </div>
        );
    }
}


export default Blockpass;