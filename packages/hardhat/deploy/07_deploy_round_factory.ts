import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployRoundFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Deploy the RoundFactory contract
  const roundFactoryDeployment = await deploy("RoundFactory", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed RoundFactory.");

  // Get the address of the deployed RoundImplementation
  const roundImplementation = await get("RoundImplementation");

  // Initialize the RoundFactory contract
  const roundFactory = await ethers.getContractAt("RoundFactory", roundFactoryDeployment.address);
  const tx = await roundFactory.initialize();
  await tx.wait();

  // Update the RoundFactory with the RoundImplementation address
  const updateTx = await roundFactory.updateRoundImplementation(roundImplementation.address);
  await updateTx.wait();

  const alloSettingsContract = await get("AlloSettings");

  if (!alloSettingsContract) {
    throw new Error(`error: missing alloSettingsContract`);
  }

  // Update alloSettingsContract in RoundFactory
  const updateAlloSettingsTx = await roundFactory.updateAlloSettings(alloSettingsContract.address);
  await updateAlloSettingsTx.wait();

  console.log(`✅ AlloSettingsContract linked to RoundFactory at ${updateAlloSettingsTx.hash}`);
};

export default deployRoundFactory;

deployRoundFactory.tags = ["RoundFactory"];
