import './App.css';
import React, {Component} from "react";
import Web3 from "web3";
import {ERC777AT_ADDRESS, ERC777AT_ABI} from "./config";


class accountInput extends Component {

}

class accountsListItem extends Component {
    render() {
        return (
            <div>
                <span>{this.props.value}</span>
                <button onClick={(i) => this.props.onClick(i)}></button>
            </div>
        )
    }

}

class accountsList extends Component {

    render() {
        return(
            <ul>

            </ul>
        )
    }

}

function Proceed(props) {
    return (
        <button onClick={props.onClick}>props.value</button>
    )
}

function ExtractCSV(props) {
    return (
        <button onClick={props.onClick}>props.value</button>
    )

}

class accountsButtons extends Component {
    render() {
        return (
            <div>
                <ExtractCSV value={"EXTRACTCSV"} onClick={() => this.props.onClick}/>
                <Proceed value={"PROCEED"} onClick={() => this.props.onClick}/>
            </div>
        )
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {account: ""};
        this.loadBlockChainData();
    }

    async loadBlockChainData() {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const network = await web3.eth.net.getNetworkType();
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]})
        const erc777AT = new web3.eth.Contract(ERC777AT_ABI, ERC777AT_ADDRESS);
        const defaultOperators = await erc777AT.methods.defaultOperators().call();
        console.log("type of: ", typeof (defaultOperators.length));
    }

    render() {
        return (
            <div className="App">
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0"
                       href="https://github.com/Asem-Abdelhady/ERC777-AirDrop" target="_blank">ERC777AT | Bulksend
                        ERC777AT tokens</a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small><a className="nav-link" href="#"><span id="account"></span></a></small>
                        </li>
                    </ul>
                </nav>
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex justify-content-center">

                    </main>
                </div>
            </div>
        );
    }
}

export default App;
