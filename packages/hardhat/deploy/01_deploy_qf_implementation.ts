import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployQFImplementation: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("QuadraticFundingVotingStrategyImplementation", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed QuadraticFundingVotingStrategyImplementation.");
};

export default deployQFImplementation;

deployQFImplementation.tags = ["QuadraticFundingVotingStrategyImplementation"];
