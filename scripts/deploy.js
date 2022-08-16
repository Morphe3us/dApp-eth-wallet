const hre = require("hardhat");

async function main() {

  const Wall3t = await hre.ethers.getContractFactory("Wall3t");
  const wall3t = await Wall3t.deploy();

  await wall3t.deployed();

  console.log("Wall3t deployed to:", wall3t.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
