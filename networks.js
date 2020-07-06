const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      protocol: "http",
      host: "localhost",
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: "*",
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          "light winter weapon runway surface inform evidence normal nominee ice surge village",
          `https://rinkeby.infura.io/v3/${"dcb3ad72562e456496781d4f125eb5b9"}`
        ),
      networkId: 4,
      gasPrice: 10e9,
    },
  },
};
