import { getABI, getNetworkName } from "../../../hardhat/scripts/utils";
import { ethers } from "ethers";
import { notification } from "~~/utils/scaffold-eth";

// ============================= Apply to Round ==============================
//
// Get cloned round contract from RoundFactory.create() & RoundImplementation
// abi, then create a contract instance & apply to round
//
// ===========================================================================
export const applyToRound = async (provider: any, roundAddress: any, projectId: any, projectMetaData: any) => {
  try {
    console.log("Project ID:", projectId);

    const signer = await provider.getSigner();
    const networkName = await getNetworkName(provider);
    const abi = getABI(networkName, "RoundImplementation").abi;

    const newApplicationMetaPtr = {
      protocol: 1, // Replace with your protocol ID
      pointer: projectMetaData,
    };

    const projectIDBytes32 = ethers.encodeBytes32String(String(projectId));
    const roundContract = new ethers.Contract(roundAddress, abi, signer);
    const transaction = await roundContract.applyToRound(projectIDBytes32, newApplicationMetaPtr);
    await transaction.wait();
    notification.success("Successfully Applied!");

    console.log(`Applied to round at ${roundAddress} with project ${projectId} with ${projectMetaData} metadata.`);
  } catch (error) {
    console.error("Error applying to round:", error);
  }
};
