import './App.css';
import React, {Component} from "react";
import Web3 from "web3";
import {ERC777AT_ADDRESS, ERC777AT_ABI} from "./config";


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

class AccountsList extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <ul className="list-group">
                {this.props.accounts.map((account, index) =>
                    <li className="list-group-item d-flex justify-content-between align-items-start" key={index}>
                        {account}
                        <span className="badge bg-primary square" style={{cursor: "pointer"}}
                              onClick={() => this.props.onClick(index)}>X</span>
                    </li>
                )}
            </ul>
        )
    }

}

function Proceed(props) {
    return (
        <button className="btn btn-secondary" style={{marginLeft: "12px"}} onClick={props.onClick}>PROCEED</button>
    )
}

function ExtractCSV(props) {
    return (
        <button className="btn btn-primary" onClick={props.onClick}>EXTRACTCSV</button>
    )

}

class AccountsButtons extends Component {
    render() {
        return (
            <div style={{marginTop: "12px"}}>
                <ExtractCSV onClick={() => this.props.onHandleProceed}/>
                <Proceed onClick={() => this.props.onHandleProceed}/>
            </div>
        )
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        this.state = {
            personalAccount: ''
            , accountsList: [],
            input: ''
        };
    }

    componentDidMount() {
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
            //Do something
            console.log("Not valid");
            return;
        }

        let accounts = this.state.accountsList;
        accounts.push(input);
        this.setState({accountsList: accounts});

    }

    onHandleExtractCSV() {

    }

    onHandleProceed() {

    }


    async loadBlockChainData() {
        const accounts = await this.web3.eth.getAccounts();
        await this.setState({personalAccount: accounts[0]})
        const erc777AT = new this.web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        console.log("account: " + this.state.personalAccount);
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
                                      onClick={index => this.onHandleRemoveAccount(index)}/>
                        <AccountsButtons onHandleProceed={this.onHandleProceed()}
                                         onHandleProcess={this.onHandleProceed()}/>
                    </main>
                </div>
            </div>
        );
    }
}

export default App;
