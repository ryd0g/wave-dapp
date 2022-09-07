const main = async () => {
  // create deployer and balance variables
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  // log deployer address and account balance
  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  // import contract
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.015"),
  });
  await waveContract.deployed();

  // log wave portal contract address
  console.log("Wave Portal address: ", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
