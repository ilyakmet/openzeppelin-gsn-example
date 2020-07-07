const { accounts, contract, web3 } = require("@openzeppelin/test-environment");

const gsn = require("@openzeppelin/gsn-helpers");

const Counter = contract.fromArtifact("Counter");
const Recipient = contract.fromArtifact("Recipient");
const IRelayHub = contract.fromArtifact("IRelayHub");

describe("GSNRecipient", function() {
  const [sender] = accounts;

  before(async function() {
    await gsn.deployRelayHub(web3);
    await gsn.runRelayer(web3, { quiet: true });
  });

  beforeEach(async function() {
    this.counter = await Counter.new();
    this.recipient = await Recipient.new(this.counter.address);
  });

  context("when called directly", function() {
    it("setOwner", async function() {
      const senderPreBalance = await web3.eth.getBalance(sender);
      console.log("senderPreBalance: ", senderPreBalance.toString());

      await this.recipient.setOwner(this.counter.address, {
        from: sender,
      });

      const senderPostBalance = await web3.eth.getBalance(sender);
      console.log("senderPostBalance: ", senderPostBalance.toString());
    });
  });

  context("when relay-called", function() {
    beforeEach(async function() {
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
