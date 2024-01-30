// tests/Airdrop.test.js
const { expect } = require("chai");
const hre = require("hardhat");

describe("Airdrop Contract", function () {
  let Airdrop;
  let airdrop;
  let MyToken;
  let myToken;
  let owner;
  let otherAccount;

  beforeEach(async function () {
    [owner, otherAccount] = await hre.ethers.getSigners();

    MyToken = await hre.ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy();

    Airdrop = await hre.ethers.getContractFactory("Airdrop");
    airdrop = await Airdrop.deploy(myToken.target);
  });

  it("should set the correct token address during deployment", async function () {
    expect(await airdrop.token()).to.equal(myToken.target);
  });

  it("should release a single transfer to the specified address", async function () {
    const recipient = otherAccount.address;
    const amount = ethers.utils.parseEther("10");

    await myToken.approve(airdrop.target, amount);
    await airdrop.releaseSingle(recipient, amount);

    const recipientBalance = await myToken.balanceOf(recipient);
    expect(recipientBalance).to.equal(amount);
  });

  it("should release multiple transfers to the specified addresses", async function () {
    const recipients = [owner.address, otherAccount.address];
    const amounts = [
      ethers.utils.parseEther("5"),
      ethers.utils.parseEther("7"),
    ];

    await myToken.approve(
      airdrop.target,
      amounts.reduce((a, b) => a.add(b), ethers.BigNumber.from("0"))
    );
    await airdrop.releaseMultiple(recipients, amounts);

    for (let i = 0; i < recipients.length; i++) {
      const recipientBalance = await myToken.balanceOf(recipients[i]);
      expect(recipientBalance).to.equal(amounts[i]);
    }
  });

  it("should not release multiple transfers with mismatched array lengths", async function () {
    const recipients = [owner.address, otherAccount.address];
    const amounts = [ethers.utils.parseEther("5")];

    await myToken.approve(airdrop.target, amounts[0]);

    await expect(
      airdrop.releaseMultiple(recipients, amounts)
    ).to.be.revertedWith("Mismatched array lengths");
  });

  it("should not release multiple transfers if caller is not the owner", async function () {
    const recipient = otherAccount.address;
    const amount = ethers.utils.parseEther("10");

    await myToken.approve(airdrop.target, amount);

    // Deploy a new contract to simulate a non-owner address
    const [, nonOwner] = await ethers.getSigners();
    const AirdropNonOwner = await ethers.getContractFactory("Airdrop");
    const airdropNonOwner = await AirdropNonOwner.deploy(myToken.target);

    await expect(
      airdropNonOwner.releaseSingle(recipient, amount)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
