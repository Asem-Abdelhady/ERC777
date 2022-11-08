# ERC777AT

ERC777AT is Ethereum ERC777 tokens built with sole purpose of learning the technology.

## Description

The project basically lets you be a tokens holder of 10000 ERC777AT with the address you used to deploy the [ERC777 contract](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/contracts/ERC777AT.sol)
after that, you can obtain the contract address and import the tokens into your favorite wallet:

![Tokens](https://user-images.githubusercontent.com/40506647/176640715-5f1b91fe-2293-426b-98ee-d5f9dc1cb196.png)

### Features

- ERC777AT operators

  - [Bulksend operator](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/contracts/BulkSendOperator.sol), it allows the holder of the tokens to send an amount of tokens to different addresses using one transaction.

  - [Staticsale operator](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/contracts/StaticSale.sol) let every ERC777AT holder let price for their token to lets other addresses buy them for this price.

  - [Etherless transfer operator](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/contracts/EtherlessTransfer.sol) Let token holder sign transaction data to allow another user to make the transaction on his behalf using the same holder's signature.

- ERC777AT hooks

  - [AT sender hook](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/contracts/ATSenderHook.sol) let the owner specify steps and requirements before the tokens leave the account.

  - [AT receiver hook](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/contracts/ATRecipientHook.sol) let the tokens receiver specify steps and requirements before the tokens enter the account.

## Visuals

visuals are the front-end representation for the ERC777AT operators using web3. you can navigate through the front-end in the [client directory](https://github.com/Asem-Abdelhady/ERC777-AirDrop/tree/master/client). **_Note: the current deployment is the goerli testnet so make sure you are connected to it to use the client applications._**

- bulk-sender client in <https://at-bulksend.vercel.app/> However, the extract CSV functionality is not implemented yet.
  ![bulk-sender](https://user-images.githubusercontent.com/40506647/176650787-63841e06-0b51-4e2d-bbdb-4e699c71780a.png)

- static-sale client in <https://at-staticsale.vercel.app/> let other addresses buy AT from my personal account [0x006510FA9a9b5b0566209347200d3300081342f3](https://goerli.etherscan.io/address/0x006510FA9a9b5b0566209347200d3300081342f3) for the amount I set.

![static-sale](https://user-images.githubusercontent.com/40506647/176658895-18009c7a-ed92-400e-b8e9-cc106d955218.png)

- price-set client in <https://at-priceset.vercel.app/> let the holder of the tokens set a price for their tokens to sell them using their own front-end or using static-sale which I will show how in the usage section

![price-set](https://user-images.githubusercontent.com/40506647/176659591-60d771bb-5030-4306-8e13-a7a0f16fc26f.png)

## Installation

before you clone the repository, make sure you have [truffle](https://trufflesuite.com/) in your machine
then run

```bash
npm install
```

## Usage

First, you need to compile the contracts if you made any changes using

```bash
truffle compile
```

then you have to deploy the contracts to a blockchain, but before you have 2 options as you can see in the [truffle-config](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/truffle-config.js).

the first option is:

```javascript
import foobar
const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();
module.exports = {
    networks: {
        rinkeby: {
            provider: () => new HDWalletProvider(process.env.MNENOMIC, "wss://rinkeby.infura.io/ws/v3/" + process.env.INFURA_API_KEY),
            network_id: 4,
            networkCheckTimeout: 1000000
        }
    },

    compilers: {
        solc: {
            version: "0.8.13"      // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            // settings: {          // See the solidity docs for advice about optimization and evmVersio
            //  evmVersion: "byzantium"
            // }
        }
    }
};
```

in this case you're deploying to rinkeby testnet so you need **_.env_** file to hold your data.

The second case is the commented section

```javascript
//
// module.exports = {
//     networks: {
//         development: {
//             host: "127.0.0.1",
//             port: 7545,
//             network_id: "*" // Match any network id
//         }
//     },
//     compilers: {
//         solc: {
//             version: "0.8.13"      // Fetch exact version from solc-bin (default: truffle's version)
//             // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
//             // settings: {          // See the solidity docs for advice about optimization and evmVersio
//             //  evmVersion: "byzantium"
//             // }
//         }
//     }
// }
```

This allows you to use the local blockchain of ganache instead so just uncomment this section if this is what you prefer.

After you decide where to deploy just run:

```bash
truffle migrate --network live
```

To use the client-side after deployment, don't forget to change the config.js file in every application with the new ABI and contract address.

To make the static-sale use your address instead, you need manually change my address from the application in [App.js](https://github.com/Asem-Abdelhady/ERC777-AirDrop/blob/master/client/static-sale/src/App.js) and put yours.

## Testing

The tests I wrote are in the [test directory](https://github.com/Asem-Abdelhady/ERC777-AirDrop/tree/master/test). **_Note: I was using the ganache during testing so I had to configure the ERC1820 registry for the local blockchain using the help of openzeppelin._**

To make your own tests just make the TestFile.test.js in the test directory and run:

```bash
truffle test ./test/TestFile.test.js
```

Or to run all the test files:

```bash
truffle test
```

## Acknowledgment

Most of the blockchain work is based on [wealdtech](https://github.com/wealdtech) explanation.
