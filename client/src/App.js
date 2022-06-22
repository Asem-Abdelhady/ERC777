import './App.css';
import React, {Component} from "react";
import Web3 from "web3";
import {BULKSENDER_ABI, BULKSENDER_ADDRESS, ERC777AT_ABI, ERC777AT_ADDRESS} from "./config";
import shikamaru from './loading.jpg'
import {Button, Modal} from "react-bootstrap";


function TransactionSucceededModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Transaction succeeded!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    You made a successful transaction, the account balance is now {props.balance} tokens.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function TransactionFailedModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Transaction failed!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    The transaction is either rejected or failed to be mined, please try again.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function InvalidAccountModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Invalid Account!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
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

function Loading(props) {
    return (
        <div id="loader" className="text-center">
            <img src={shikamaru} alt="Shikamaru is dying but the transaction is being processed!"
                 style={{margin: "30px"}}/>
            <p className="text-center">Loading the transaction nenjtsu !</p>
        </div>
    )
}

class AccountInput extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Enter account"
                           aria-label="Enter account" aria-describedby="button-addon2" id="account-input"
                           onChange={this.props.onChange} value={this.props.input}></input>
                    <button className="btn btn-outline-primary" type="submit" id="button-addon2">Save
                    </button>
                </div>
            </form>
        )
    }
}

function AccountsList(props) {
    return (
        <ul className="list-group" style={{marginBottom: "12px"}}>
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
            invalidAccountModalShow: false,
            transactionFailedModalShow: false,
            transactionSucceededModalShow: false,
            personalAccountBalance: 0,
            loading: false
        };
    }

    componentDidMount() {
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        this.loadBlockChainData();
    }

    async onHandleRemoveAccount(accountIndex) {

        let accounts = this.state.accountsList.filter((value, index) => index !== accountIndex);

        await this.setState({accountsList: accounts});

    }

    onHandleInput(event) {
        this.setState({input: event.target.value});
        console.log("input state: " + this.state.input);
    }

    onHandleSubmit(event) {
        event.preventDefault();
        const input = this.state.input;
        if (!(this.web3.utils.isAddress(input))) {
            this.setState({invalidAccountModalShow: true});
        } else {
            let accounts = this.state.accountsList;
            accounts.push(input);
            this.setState({accountsList: accounts});
        }
        this.setState({input: ''});

    }

    onHandleExtractCSV() {

    }

    async afterTransactionSucceeded() {
        const emptyAccountsList = [];
        this.setState({accountsList: emptyAccountsList});
        this.setState({loading: false});
        const balance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        this.setState({personalAccountBalance: balance});
        console.log("Personal account balance: " + this.state.personalAccountBalance);
        this.setState({transactionSucceededModalShow: true});
    }

    async afterTransactionFailed() {
        this.setState({loading: false});
        this.setState({transactionFailedModalShow: true});
    }

    async onHandleProceed(event) {
        let accountsList = this.state.accountsList;
        console.log("Address 0: " + accountsList[0] + "-------- type of: " + typeof (accountsList[0]));
        this.setState({loading: true});
        this.bulkSender.methods.send(ERC777AT_ADDRESS, accountsList, 20, 1).send({from: this.personalAccount})
            .then((receipt) => {
                this.afterTransactionSucceeded();
            }).catch((error) => {
                this.afterTransactionFailed();
        });
    }


    async loadBlockChainData() {
        this.accounts = await this.web3.eth.getAccounts();
        this.personalAccount = this.accounts[0];
        this.setState({personalAccount: this.personalAccount});
        this.erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        this.bulkSender = new this.web3.eth.Contract(BULKSENDER_ABI, BULKSENDER_ADDRESS);
        console.log("Personal Account " + this.personalAccount);
        const balance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        this.setState({personalAccountBalance: balance});
        console.log("The balance is : " + balance);
    }

    render() {
        return (
            !this.state.loading ?
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
                                          onSubmit={event => this.onHandleSubmit(event)}
                                          input={this.state.input}/>
                            <AccountsList accounts={this.state.accountsList}
                                          onClick={index => this.onHandleRemoveAccount(index)}/>
                            <ExtractCSV onClick={event => this.onHandleExtractCSV()}/>
                            <Proceed onClick={event => this.onHandleProceed(event)}/>
                        </main>
                    </div>
                    <InvalidAccountModal show={this.state.invalidAccountModalShow}
                                         onHide={() => this.setState({invalidAccountModalShow: false})}/>
                    <TransactionSucceededModal show={this.state.transactionSucceededModalShow}
                                               onHide={() => this.setState({transactionSucceededModalShow: false})}
                                               balance={this.state.personalAccountBalance}/>
                    <TransactionFailedModal show={this.state.transactionFailedModalShow}
                                            onHide={() => this.setState({transactionFailedModalShow: false})}/>
                </div> : <Loading/>
        );
    }
}

export default App;
