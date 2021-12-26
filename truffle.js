

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "45f4988a4a1644b6978f8b8673bd264a";
//
const fs = require('fs');
const mnemonic = fs.readFileSync("secret.txt").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,
      gas: 5500000,
    },
  }
};