import './App.css';
import React, {Component} from "react";
import Web3 from "web3";
import {ERC777AT_ADDRESS, ERC777AT_ABI} from "./config";


class App extends Component {
    constructor(props) {
        super(props);
        this.state ={account: ""};
        this.loadBlockChainData();
    }
    async loadBlockChainData() {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const network = await web3.eth.net.getNetworkType();
      const accounts = await web3.eth.getAccounts();
      const erc777AT = new web3.eth.Contract(ERC777AT_ABI,ERC777AT_ADDRESS);
      const defaultOperators = await erc777AT.methods.defaultOperators().call();
      console.log("type of: ", defaultOperators.length);
    }

    render() {
        return (
            <div className="App">
                <h1>Hello, World</h1>
                <p>Your account: {this.state.account}</p>
            </div>
        );
    }
}

export default App;
