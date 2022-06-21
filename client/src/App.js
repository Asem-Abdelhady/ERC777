import './App.css';
import React, {Component, useState} from "react";
import Web3 from "web3";
import {ERC777AT_ADDRESS,ERC777AT_ABI, BULKSENDER_ABI, BULKSENDER_ADDRESS} from "./config";
import {Button, Modal} from "react-bootstrap";

function NotValidAccountModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                    The account you entered is not valid, please enter a valid one!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

class AccountInput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    }


    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Enter account"
                           aria-label="Enter account" aria-describedby="button-addon2" id="account-input"
                           onChange={this.props.onChange}></input>
                    <button className="btn btn-outline-primary" type="submit" id="button-addon2">Save
                    </button>
                </div>
            </form>
        )
    }
}

function AccountsList(props) {
    //
    // const [modalShow, setModalShow] = React.useState(false);
    // if(!props.isAccount) setModalShow(true)
    // console.log(props.isAccount);
    return (
        <ul className="list-group" style={{marginBottom:"12px"}}>
            {props.accounts.map((account, index) =>
                <li className="list-group-item d-flex justify-content-between align-items-start" key={index}>
                    {account}
                    <span className="badge bg-primary square" style={{cursor: "pointer"}}
                          onClick={() => props.onClick(index)}>X</span>
                </li>
            )}
        </ul>

    )
}

function Proceed(props) {
    return (
        <button className="btn btn-primary" style={{marginLeft: "12px"}} onClick={props.onClick}>PROCEED</button>
    )
}

function ExtractCSV(props) {
    return (
        <button className="btn btn-secondary" onClick={props.onClick}>EXTRACTCSV</button>
    )

}

class AccountsButtons extends Component {
    render() {
        return (
            <div style={{marginTop: "12px"}}>
                <ExtractCSV onClick={() => this.props.onHandleExtractCSV}/>
                <Proceed onClick={() => this.props.onHandleProceed}/>
            </div>
        )
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountsList: [],
            input: '',
            isValidInput: true,
        };
    }

    componentDidMount() {
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        this.loadBlockChainData();
    }

    async onHandleRemoveAccount(accountIndex) {

        let accounts = this.state.accountsList.filter((value, index) => index !== accountIndex);

        await this.setState({accountsList: accounts});
        console.log(this.state.accountsList);


    }

    onHandleInput(event) {
        this.setState({input: event.target.value});
        console.log("input state: " + this.state.input);
    }

    onHandleSubmit(event) {
        event.preventDefault();
        const input = this.state.input;
        if (!(this.web3.utils.isAddress(input))) {
            this.setState({isValidInput: false});
        } else {
            this.setState({isValidInput: true});
            let accounts = this.state.accountsList;
            accounts.push(input);
            this.setState({accountsList: accounts});

        }

    }

    onHandleExtractCSV() {

    }

    async onHandleProceed(event) {
        let accountsList = this.state.accountsList;
        console.log("Address 0: " + accountsList[0] + "-------- type of: "+  typeof (accountsList[0]));
        await this.bulkSender.methods.send(ERC777AT_ADDRESS, accountsList, 100, 1).send({from: this.personalAccount})
            .once('receipt', (receipt) => {
                for(var i = 0; i < accountsList.length; i++){
                    console.log("From once Account " + i + " balance: " + this.erc777AT.methods.balanceOf(accountsList[i]).call());
                }
            });
        for(var i = 0; i < accountsList.length; i++){
            console.log("Outside once Account " + i + " balance: " + this.erc777AT.methods.balanceOf(accountsList[i]).call());
        }

     }


    async loadBlockChainData() {
        this.accounts = await this.web3.eth.getAccounts();
        console.log("length = "  + this.accounts.length);
        this.personalAccount = this.accounts[0];
        this.erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        this.bulkSender = new this.web3.eth.Contract(BULKSENDER_ABI,BULKSENDER_ADDRESS);
         console.log("Personal Account " +  this.personalAccount);
        const balance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        console.log("The balance is : "+balance);
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow p-2">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0"
                       href="https://github.com/Asem-Abdelhady/ERC777-AirDrop" target="_blank">ERC777AT | Bulksend
                        ERC777AT tokens</a>
                    <span className="d-flex text-white">{this.state.personalAccount}</span>
                </nav>
                <div>
                    <main style={{margin: "auto", marginTop: "120px", width: "500px"}}>
                        <AccountInput onChange={event => this.onHandleInput(event)}
                                      onSubmit={event => this.onHandleSubmit(event)}/>
                        <AccountsList accounts={this.state.accountsList}
                                      onClick={index => this.onHandleRemoveAccount(index)}
                                      isAccount={this.state.isValidInput}/>
                        <ExtractCSV onClick={event => this.onHandleExtractCSV()}/>
                        <Proceed onClick={event => this.onHandleProceed(event)}/>
                    </main>
                </div>
            </div>
        );
    }
}

export default App;
