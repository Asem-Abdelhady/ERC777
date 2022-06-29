import './App.css';
import React, {Component} from "react";
import Web3 from "web3";
import {BULKSENDER_ABI, BULKSENDER_ADDRESS, ERC777AT_ABI, ERC777AT_ADDRESS} from "./config";
import shikamaru from './loading.jpg'
import {Button, Form, Modal} from "react-bootstrap";
import detectEthereumProvider from "@metamask/detect-provider";


function EnterAmountToSendModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Please enter the amount you want to send to every address
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Amount: </Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        placeholder="Enter the amount"
                        autoFocus
                        onChange={props.onChange}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>

                <Button variant="primary" onClick={props.onSendTokens} disabled={props.isTokensAmountEmpty}>
                    Send tokens
                </Button>
            </Modal.Footer>
        </Modal>

    );
}


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
                    The transaction is {props.transactionFailedStatus}.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function NotEnoughTokensModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Not enough tokens!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    There are no enough AT tokens in the account to make the transaction.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

function InvalidAccountModal(props) {
    return (
        <Modal
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
                    <button className="btn btn-outline-primary" type="submit" id="button-addon2"
                            style={{marginLeft: "12px"}}>Save
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
        <button className="btn btn-primary" style={{marginLeft: "12px"}} onClick={props.onClick} disabled={props.isEmptyList}>PROCEED</button>
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
            tokensAmountToSendModalShow: false,
            notEnoughTokensModalShow: false,
            personalAccountBalance: 0,
            tokensAmountToSend: 0,
            isTokensAmountEmpty: true,
            isEmptyList: true,
            transactionFailedStatus: '',
            loading: false,
        };
    }

    componentDidMount() {
        this.loadBlockChainData();
    }

    async onHandleRemoveAccount(accountIndex) {

        let accounts = this.state.accountsList.filter((value, index) => index !== accountIndex);
        if(accounts.length === 0) this.setState({isEmptyList:true});

        await this.setState({accountsList: accounts});

    }

    onHandleInput(event) {
        this.setState({input: event.target.value});
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
            this.setState({isEmptyList:false});
        }
        this.setState({input: ''});

    }

    onHandleExtractCSV() {

    }

    async afterTransactionSucceeded() {
        const emptyAccountsList = [];
        this.setState({accountsList: emptyAccountsList});
        this.setState({loading: false});
        let balance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        balance = this.web3.utils.toBN(balance);
        balance = balance.div(this.gran).toNumber();
        this.setState({personalAccountBalance: balance});
        this.setState({transactionSucceededModalShow: true});
    }

    async afterTransactionFailed() {
        this.setState({loading: false});
        this.setState({transactionFailedModalShow: true});
    }

    async onHandleProceed(event) {
        this.setState({tokensAmountToSendModalShow: true});
    }

    async onHandleSendTokens(event) {
        this.setState({tokensAmountToSendModalShow: false});
        this.setState({loading: true});
        let accountsList = this.state.accountsList;
        const amountToSendFromUser = this.web3.utils.toBN(this.state.tokensAmountToSend);
        const amountToSendToContract = this.gran.mul(amountToSendFromUser);

        this.setState({loading: true});
        this.bulkSender.methods.send(ERC777AT_ADDRESS, accountsList, amountToSendToContract, 1).send({from: this.personalAccount})
            .then((receipt) => {
                this.afterTransactionSucceeded();
                this.setState({isTokensAmountEmpty: true});
                this.setState({isEmptyList:true});
            }).catch((error) => {
            this.setState({loading: false});
            if (error.code === -32603) {
                this.setState({notEnoughTokensModalShow: true})
            } else if (error.code === 4001) {
                this.setState({transactionFailedStatus: 'rejected from the user'})
                this.afterTransactionFailed();
            } else {
                this.setState({transactionFailedStatus: 'failed to be mined'})
                this.afterTransactionFailed();
            }
        });
    }

    onHandleTokensAmountInput(event) {
        const tokensAmountInput = event.target.value;
        (tokensAmountInput === '') ? this.setState({isTokensAmountEmpty: true}) : this.setState({isTokensAmountEmpty: false});
        this.setState({tokensAmountToSend: tokensAmountInput});
    }


    async loadBlockChainData() {
        const provider = await detectEthereumProvider();
        if (provider) {
            this.web3 = new Web3(provider);
            this.accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        } else {
            alert('Please install MetaMask!');
        }
        this.personalAccount = this.accounts[0];
        this.gran = this.web3.utils.toBN(10 ** 18);
        this.setState({personalAccount: this.personalAccount});
        this.erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        this.bulkSender = new this.web3.eth.Contract(BULKSENDER_ABI, BULKSENDER_ADDRESS);
        const balance = await this.erc777AT.methods.balanceOf(this.personalAccount).call();
        this.setState({personalAccountBalance: balance});
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
                            <Proceed onClick={event => this.onHandleProceed(event)} isEmptyList={this.state.isEmptyList}/>
                        </main>
                    </div>
                    <InvalidAccountModal show={this.state.invalidAccountModalShow}
                                         onHide={() => this.setState({invalidAccountModalShow: false})}/>
                    <NotEnoughTokensModal show={this.state.notEnoughTokensModalShow}
                                          onHide={() => this.setState({notEnoughTokensModalShow: false})}/>
                    <TransactionSucceededModal show={this.state.transactionSucceededModalShow}
                                               onHide={() => this.setState({transactionSucceededModalShow: false})}
                                               balance={this.state.personalAccountBalance}/>
                    <TransactionFailedModal show={this.state.transactionFailedModalShow}
                                            onHide={() => this.setState({transactionFailedModalShow: false})}
                                            transactionFailedStatus={this.state.transactionFailedStatus}/>
                    <EnterAmountToSendModal show={this.state.tokensAmountToSendModalShow}
                                            onHide={() => this.setState({tokensAmountToSendModalShow: false})}
                                            onSendTokens={event => this.onHandleSendTokens(event)}
                                            onChange={event => this.onHandleTokensAmountInput(event)}
                                            isTokensAmountEmpty={this.state.isTokensAmountEmpty}/>
                </div> : <Loading/>
        );
    }
}

export default App;
