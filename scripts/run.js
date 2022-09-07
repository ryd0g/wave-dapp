const main = async () => {
  // contract variables
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();

  // log address of contract and deployer
  console.log("Contract deployed to:", waveContract.address);

  // get contract balance
  let contractBal = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBal));

  // variables from wave contract
  let waveCount;
  waveCount = await waveContract.getTotal();
  console.log(waveCount.toNumber());

  let waveTxn = await waveContract.wave("Test Message 1!");
  await waveTxn.wait();

  // contract balance get
  contractBal = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract Balance: ", hre.ethers.utils.formatEther(contractBal));

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
