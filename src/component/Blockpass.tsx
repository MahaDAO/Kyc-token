
import React, { Component } from 'react';

class Blockpass extends React.Component<{},any>{
    constructor(props: any) {
        super(props)

        this.state = {
            walletAddress: '',
            email: '',
            name: ''
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
            body: JSON.stringify({ 
                address: this.state.walletAddress,
                name: this.state.name,
                email: this.state.email
            })
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
                    <h2>
                        Please add name, email exactly similar to the one you are adding in the blockpass widget !!!
                    </h2>
                    <h3>
                        Once we get the paid we don't have to do this steps
                    </h3>
                    <h3>Name</h3>
                    <input 
                        className='name'
                        type="text"
                        value={this.state.name}
                        onChange={event => this.setState({ name: event.target.value })}
                    />
                    <br/>
                    <br/>
                    <h3>Email</h3>
                    <input 
                        className='email'
                        type="text"
                        value={this.state.email}
                        onChange={event => this.setState({ email: event.target.value })}
                    />
                    <br/>
                    <br/>
                    <h3>Wallet Address</h3>
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