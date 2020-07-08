const { accounts, contract, web3 } = require("@openzeppelin/test-environment");

const gsn = require("@openzeppelin/gsn-helpers");
const { ether, expectEvent } = require("@openzeppelin/test-helpers");

const Counter = contract.fromArtifact("Counter");
const Recipient = contract.fromArtifact("Recipient");
const IRelayHub = contract.fromArtifact("IRelayHub");

describe("GSNRecipient", function() {
  const [sender] = accounts;

  // before(async function() {
  //   this.counter = await Counter.new();
  //   this.recipient = await Recipient.new(this.counter.address);

  //   await gsn.runRelayer(web3, {
  //     relayUrl: "http://localhost:8000",
  //     workdir: process.cwd(), // defaults to a tmp dir
  //     devMode: true,
  //     ethereumNodeURL: "http://localhost:8545",
  //     gasPricePercent: 0,
  //     port: 8000,
  //     quiet: true,
  //   });

  //   await gsn.deployRelayHub(web3);
  //   await gsn.fundRecipient(web3, { recipient: this.recipient.address });

  //   this.relayHub = await IRelayHub.at(
  //     "0xD216153c06E857cD7f72665E0aF1d7D82172F494"
  //   );
  // });

  // context("when called directly", function() {
  //   it("setOwner", async function() {
  //     const senderPreBalance = await web3.eth.getBalance(sender);
  //     console.log("senderPreBalance: ", senderPreBalance.toString());

  //     await this.recipient.setOwner(this.counter.address, {
  //       from: sender,
  //     });

  //     const senderPostBalance = await web3.eth.getBalance(sender);
  //     console.log("senderPostBalance: ", senderPostBalance.toString());
  //   });
  // });

  context("when relay-called", function() {
    before(async function() {
      this.counter = await Counter.new();
      this.recipient = await Recipient.new(this.counter.address);

      await gsn.runRelayer(web3, {
        relayUrl: "http://localhost:8090",
        workdir: process.cwd(), // defaults to a tmp dir
        devMode: true,
        ethereumNodeURL: "http://localhost:8545",
        gasPricePercent: 0,
        port: 8090,
        quiet: true,
      });

      await gsn.deployRelayHub(web3);

      gsn.registerRelay({
        relayUrl: "http://localhost:8090",
        stake: ether("1"),
        unstakeDelay: 604800, // 1 week
        funds: ether("5"),
        from: web3.eth.accounts[0],
      });

      await gsn.fundRecipient(web3, { recipient: this.recipient.address });

      this.relayHub = await IRelayHub.at(
        "0xD216153c06E857cD7f72665E0aF1d7D82172F494"
      );
    });

    it("setOwner", async function() {
      const recipientPreBalance = await this.relayHub.balanceOf(
        this.recipient.address
      );

      console.log("recipientPreBalance: ", recipientPreBalance.toString());

      const senderPreBalance = await web3.eth.getBalance(sender);
      console.log("senderPreBalance: ", senderPreBalance.toString());

      await this.recipient.setOwner(this.counter.address, {
        from: sender,
        useGSN: true,
      });

      const senderPostBalance = await web3.eth.getBalance(sender);
      console.log("senderPostBalance: ", senderPostBalance.toString());

      const recipientPostBalance = await this.relayHub.balanceOf(
        this.recipient.address
      );

      console.log("recipientPostBalance: ", recipientPostBalance.toString());
    });
  });
});
