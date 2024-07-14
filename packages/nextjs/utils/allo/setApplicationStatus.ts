import { getABI, getNetworkName } from "../../../hardhat/scripts/utils";
import { ethers } from "ethers";

export enum ApplicationStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
  CANCELED,
}

interface ApplicationStatusUpdate {
  index: number;
  status: ApplicationStatus;
}

function buildStatusRow(currentStatuses: bigint, updates: ApplicationStatusUpdate[]): bigint {
  for (const { index, status } of updates) {
    const shift = BigInt(index * 2);
    const mask = BigInt(3) << shift;
    currentStatuses = (currentStatuses & ~mask) | (BigInt(status) << shift);
  }
  return currentStatuses;
}

export async function setApplicationStatuses(
  provider: ethers.BrowserProvider,
  roundAddress: string,
  statuses: ApplicationStatusUpdate[],
  applicationStatusBitMapIndex: number = 0,
) {
  try {
    const signer = await provider.getSigner();
    const networkName = await getNetworkName(provider);
    const roundImplementationABI = getABI(networkName, "RoundImplementation").abi;
    const contract = new ethers.Contract(roundAddress, roundImplementationABI, signer);

    // Get the current application statuses bitmap
    const currentStatuses = await contract.applicationStatusesBitMap(applicationStatusBitMapIndex);
    let newState = BigInt(currentStatuses.toString());

    // Check for updates and build new state only if necessary
    const updatesToApply = statuses.filter(({ index, status }) => {
      const shift = BigInt(index * 2);
      const currentStatus = (newState >> shift) & BigInt(3);
      return currentStatus !== BigInt(status);
    });

    if (updatesToApply.length === 0) {
      console.log("⚠️ No changes detected in application statuses. Skipping update.");
      return;
    }

    newState = buildStatusRow(newState, updatesToApply);

    // Define the new application status
    const applicationStatus = {
      index: applicationStatusBitMapIndex,
      statusRow: newState,
    };

    // Send the transaction to update application statuses
    const updateTx = await contract.setApplicationStatuses([applicationStatus]);
    await updateTx.wait();

    console.log("✅ Application statuses updated: ", updateTx.hash);

    // Verify the update by checking the new application statuses bitmap
    const updatedStatuses = await contract.applicationStatusesBitMap(applicationStatusBitMapIndex);
    if (updatedStatuses.toString() === newState.toString()) {
      console.log("✅ Application statuses verified: ", updatedStatuses.toString());
    } else {
      console.error("❌ Application statuses verification failed: ", {
        expected: newState.toString(),
        actual: updatedStatuses.toString(),
      });
      throw new Error("Application statuses verification failed");
    }
  } catch (error) {
    console.error("Failed to set application statuses:", error);
    throw error;
  }
}
