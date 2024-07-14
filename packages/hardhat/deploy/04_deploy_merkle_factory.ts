import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployMerklePayoutFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Deploy the MerklePayoutStrategyFactory contract
  const merklePayoutFactoryDeployment = await deploy("MerklePayoutStrategyFactory", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed MerklePayoutStrategyFactory.");

  // Get the address of the deployed MerklePayoutStrategyImplementation
  const merklePayoutStrategyImplementation = await get("MerklePayoutStrategyImplementation");

  // Initialize the MerklePayoutStrategyFactory contract
  const merklePayoutFactory = await ethers.getContractAt(
    "MerklePayoutStrategyFactory",
    merklePayoutFactoryDeployment.address,
  );
  const tx = await merklePayoutFactory.initialize();
  await tx.wait();

  // Update the MerklePayoutStrategyFactory with the MerklePayoutStrategyImplementation address
  const updateTx = await merklePayoutFactory.updatePayoutImplementation(merklePayoutStrategyImplementation.address);
  await updateTx.wait();
};

export default deployMerklePayoutFactory;

deployMerklePayoutFactory.tags = ["MerklePayoutStrategyFactory"];
