const Web3 = require("web3");
const { GSNProvider } = require("@openzeppelin/gsn-provider");
const {
  deployRelayHub,
  runRelayer,
  fundRecipient,
} = require("@openzeppelin/gsn-helpers");

const web3 = new Web3(new GSNProvider("http://localhost:8545"));

// load Counter json artifact
const counterJSON = require("./build/contracts/Counter.json");

const start = async () => {
  const [acc1] = await web3.eth.getAccounts();

  const networkId = await web3.eth.net.getId();

  const deployedNetwork = counterJSON.networks[networkId.toString()];

  //   await fundRecipient(web3, {
  //     recipient: deployedNetwork.address.toString(),
  //     amount: 50000000,
  //     from: acc1,
  //   });

  const instance = new web3.eth.Contract(
    counterJSON.abi,
    deployedNetwork.address
  );

  //   console.log(deployedNetwork.address);

  // Sends the transaction via the GSN
  await instance.methods.increase().send({ from: acc1 });

  const res = await instance.methods.value().call();

  console.log(res);
};

start();
