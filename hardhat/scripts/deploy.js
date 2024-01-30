const hre = require("hardhat");

async function main() {
  const airdrop = await hre.ethers.deployContract("Airdrop");
  await airdrop.waitForDeployment();

  console.log("Airdrop deployed to:", airdrop.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Airdrop deployed to: 0xA241589c5abA5e82420336b893A6028f8AA86c18
