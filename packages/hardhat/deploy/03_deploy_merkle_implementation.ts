import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployMPImplementation: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MerklePayoutStrategyImplementation", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed MerklePayoutStrategyImplementation.");
};

export default deployMPImplementation;

deployMPImplementation.tags = ["MerklePayoutStrategyImplementation"];
