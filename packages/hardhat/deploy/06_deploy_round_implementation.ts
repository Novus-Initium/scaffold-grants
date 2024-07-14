import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployRoundImplementation: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("RoundImplementation", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed RoundImplementation.");
};

export default deployRoundImplementation;

deployRoundImplementation.tags = ["RoundImplementation"];
