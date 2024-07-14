import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployQuadraticFundingFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Deploy the QuadraticFundingVotingStrategyFactory contract
  const quadraticFundingFactoryDeployment = await deploy("QuadraticFundingVotingStrategyFactory", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed QuadraticFundingVotingStrategyFactory.");

  // Get the address of the deployed QuadraticFundingVotingStrategyImplementation
  const quadraticFundingVotingStrategyImplementation = await get("QuadraticFundingVotingStrategyImplementation");

  // Initialize the ProgramFactory contract
  const quadraticFundingFactory = await ethers.getContractAt(
    "QuadraticFundingVotingStrategyFactory",
    quadraticFundingFactoryDeployment.address,
  );
  const tx = await quadraticFundingFactory.initialize();
  await tx.wait();

  // Update the QuadraticFundingVotingStrategyFactory with the QuadraticFundingVotingStrategyImplementation address
  const updateTx = await quadraticFundingFactory.updateVotingContract(
    quadraticFundingVotingStrategyImplementation.address,
  );
  await updateTx.wait();
};

export default deployQuadraticFundingFactory;

deployQuadraticFundingFactory.tags = ["QuadraticFundingVotingStrategyFactory"];
