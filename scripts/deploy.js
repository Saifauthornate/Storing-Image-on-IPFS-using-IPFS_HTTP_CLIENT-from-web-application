const {ethers} = require("hardhat");

async function main() {
 
  const contract = await ethers.getContractFactory("MyNft");
  const MyContract = await contract.deploy();

  await MyContract.deployed();

  console.log("NFT Contract is Deployed to:", MyContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
