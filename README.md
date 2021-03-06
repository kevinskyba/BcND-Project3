# Supply chain & data auditing

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

Contract Transaction: https://rinkeby.etherscan.io/tx/0xd1e5fefd66489a0c6a30e57f9b13931fa91a0213e35aa5fb9cb75559c0d80189
Contract Address: 0xf7D8bC2Fab0bFeB3CD34b7409340f8F985f457e6

## UML

You can find the UML diagrams in `/uml`.

## Libraries

This project uses

* Truffle v5.4.25: Truffle is used for ganache. Ganache allows us to have a local ethereum blockchain
* Solidity v0.5.16: Solidity is the programming language used to program ethereum smart contracts
* Node v16.13.1: Node is used for Webpack and for developing our frontend
* Web3.js v1.5.3: Web3.js allows our website to interact with the smart contracts using MetaMask
* materializecss v1.0.0: For visualization we are using the CSS of materializecss


## IPFS

IPFS is not used in this project.

## General

To compile the contract, run `truffle compile`. After that you can deploy it to your local ganache
blockchain using `truffle migrate`. After that, run your local frontend using `npm run dev`.

