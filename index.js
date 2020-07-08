const { accounts, contract, web3 } = require("@openzeppelin/test-environment");

const gsn = require("@openzeppelin/gsn-helpers");

const f = async () => {
  await gsn.runRelayer(web3, {
    relayUrl: "http://localhost:8000",
    workdir: process.cwd(), // defaults to a tmp dir
    devMode: true,
    ethereumNodeURL: "http://localhost:8545",
    gasPricePercent: 0,
    port: 8000,
    quiet: true,
  });
};

f();
