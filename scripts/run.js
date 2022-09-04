const main = async () => {
  // contract variables
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  // log address of contract and deployer
  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  // variables from wave contract
  let count;
  count = await waveContract.getTotal();

  let txn = await waveContract.wave();
  await txn.wait();

  count = await waveContract.getTotal();

  txn = await waveContract.connect(randomPerson).wave();
  await txn.wait();

  count = await waveContract.getTotal();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
};

runMain();
