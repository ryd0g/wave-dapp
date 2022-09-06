const main = async () => {
  // contract variables
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  // log address of contract and deployer
  console.log("Contract deployed to:", waveContract.address);

  // variables from wave contract
  let waveCount;
  waveCount = await waveContract.getTotal();
  console.log(waveCount.toNumber());

  let waveTxn = await waveContract.wave("Test Message!");
  await waveTxn.wait();

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract
    .connect(randomPerson)
    .wave("Another Test Message!");
  await waveTxn.wait();

  let all = await waveContract.getAll();
  console.log(all);
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
