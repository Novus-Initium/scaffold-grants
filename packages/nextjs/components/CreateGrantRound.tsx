"use client";

import React, { useEffect, useState } from "react";
import { encodeRoundParameters } from "../../hardhat/scripts/utils";
import { getABI, getNetworkName } from "../../hardhat/scripts/utils";
import { ApplicationStatus, setApplicationStatuses } from "../utils/allo/setApplicationStatus";
import axios from "axios";
import { BrowserProvider, Contract, Interface, getAddress, isAddress, parseUnits } from "ethers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// Define AddressZero manually
const AddressZero = "0x0000000000000000000000000000000000000000";

const CreateRoundForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [matchAmount, setMatchAmount] = useState<string>("");
  const [token, setToken] = useState<string>(AddressZero);
  const [roundFeePercentage, setRoundFeePercentage] = useState<string>("");
  const [roundFeeAddress, setRoundFeeAddress] = useState<string>("");
  const [applicationsStartTime, setApplicationsStartTime] = useState<Date | null>(null);
  const [applicationsEndTime, setApplicationsEndTime] = useState<Date | null>(null);
  const [roundStartTime, setRoundStartTime] = useState<Date | null>(null);
  const [roundEndTime, setRoundEndTime] = useState<Date | null>(null);
  //   const [networkName, setNetworkName] = useState<string | null>(null);
  const { isMining } = useScaffoldWriteContract("RoundFactory");

  useEffect(() => {
    const fetchOwnerAddress = async () => {
      try {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setOwnerAddress(address);

        // const network = await provider.getNetwork();
        // const chainId = network.chainId.toString();
        // const detectedNetworkName = chainIdToNetworkName[chainId] || "localhost";

        // setNetworkName(detectedNetworkName);
      } catch (error) {
        console.error("Failed to get owner address or network ID:", error);
        // setNetworkName(null); // Explicitly set networkName to null on error
      }
    };

    setRoundFeePercentage(process.env.ROUND_FEE_PERCENTAGE || "2");
    setRoundFeeAddress(process.env.ROUND_FEE_ADDRESS || "0x8DE8260C05611426c9A11Bf63b794c7183f30ecB");
    fetchOwnerAddress();
  }, []);

  const handleUploadToPinata = async (metadata: any) => {
    try {
      const response = await axios.post("/api/uploadToPinata", { metadata });
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw error;
    }
  };

  const handleCreateRound = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validateAddress = (address: string) => {
        if (!isAddress(address)) {
          throw new Error(`Invalid address: ${address}`);
        }
        return getAddress(address);
      };

      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const networkName = await getNetworkName(provider);

      const roundFactory = getABI(networkName, "RoundFactory");
      console.log("Network Name", networkName);
      const contract = new Contract(roundFactory.address, roundFactory.abi, signer) as unknown as Contract & {
        interface: Interface;
      };
      console.log("Round Factory Address: ", roundFactory.address);
      console.log("Round Factory ABI: ", roundFactory.abi);
      console.log("Contract: ", contract);
      const votingStrategyFactory = getABI(networkName, "QuadraticFundingVotingStrategyFactory");
      const payoutStrategyFactory = getABI(networkName, "MerklePayoutStrategyFactory");

      const initAddress = {
        votingStrategyFactory: validateAddress(votingStrategyFactory.address),
        payoutStrategyFactory: validateAddress(payoutStrategyFactory.address),
      };

      console.log("Init Address:", initAddress);

      const initRoundTime = {
        applicationsStartTime: applicationsStartTime ? Math.floor(applicationsStartTime.getTime() / 1000) : 0,
        applicationsEndTime: applicationsEndTime ? Math.floor(applicationsEndTime.getTime() / 1000) : 0,
        roundStartTime: roundStartTime ? Math.floor(roundStartTime.getTime() / 1000) : 0,
        roundEndTime: roundEndTime ? Math.floor(roundEndTime.getTime() / 1000) : 0,
      };

      console.log("Init Round Time:", initRoundTime);

      const applicationMetadata = {
        name: "Application",
        description: "This is an application for the grant round",
      };

      const initRoles = {
        adminRoles: [validateAddress(ownerAddress)],
        roundOperators: [validateAddress(ownerAddress)],
      };

      console.log("Init Roles:", initRoles);

      const roundMetadata = {
        name: name,
        description: description,
        applicationsStartTime: applicationsStartTime,
        applicationsEndTime: applicationsEndTime,
        roundStartTime: roundStartTime,
        roundEndTime: roundEndTime,
        matchAmount: matchAmount,
        token: token,
        roundFeePercentage: roundFeePercentage,
        roundFeeAddress: roundFeeAddress,
        ownerAddress: ownerAddress,
        initRoles: initRoles,
      };

      const roundMetaPtrCID = await handleUploadToPinata(roundMetadata);
      const applicationMetaPtrCID = await handleUploadToPinata(applicationMetadata);

      const initMetaPtr = {
        roundMetaPtr: { protocol: BigInt(1), pointer: roundMetaPtrCID },
        applicationMetaPtr: { protocol: BigInt(1), pointer: applicationMetaPtrCID },
      };

      console.log("Init Meta Ptr:", initMetaPtr);

      const matchAmountParsed = parseUnits(matchAmount, 18);

      console.log("Match Amount Parsed:", matchAmountParsed);
      console.log("Match Amount Parsed:", matchAmountParsed);

      const params = [
        initAddress,
        initRoundTime,
        matchAmountParsed,
        validateAddress(token),
        parseInt(roundFeePercentage),
        validateAddress(roundFeeAddress),
        initMetaPtr,
        initRoles,
      ];

      console.log("Parameters", params);

      // Encode parameters using the encodeRoundParameters function

      const encodedParameters = encodeRoundParameters(params);

      // Log encoded parameters for debugging
      console.log("Encoded Parameters:", encodedParameters);

      contract.on("RoundCreated", async roundAddress => {
        console.log(`Round created at address: ${roundAddress}`);
        const statuses = [
          { index: 0, status: ApplicationStatus.PENDING },
          { index: 1, status: ApplicationStatus.ACCEPTED },
          { index: 2, status: ApplicationStatus.REJECTED },
          { index: 3, status: ApplicationStatus.CANCELED },
        ];

        // Update the roundMetaData on IPFS and update the MetaPtr
        await setApplicationStatuses(provider, roundAddress, statuses);
        notification.success("Application statuses set successfully");
      });

      // Call the contract method
      const tx = await contract.create(encodedParameters, validateAddress(ownerAddress));

      notification.success(`Round created successfully/n${tx.hash}`);
    } catch (error: any) {
      console.error("Contract call failed:", error);
      console.error("Error Details:", JSON.stringify(error, null, 2));
      notification.error(`Failed to create round: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleCreateRound} className=" bg-base-400 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-black"></h1>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Round Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-white rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Round Description
        </label>
        <input
          id="name"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-yellow-100 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="matchAmount" className="block text-sm font-medium text-white">
          Match Amount
        </label>
        <input
          id="matchAmount"
          type="text"
          value={matchAmount}
          onChange={e => setMatchAmount(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-yellow-100 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-white">
          Token Address (use 0x000...000 for ETH)
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={e => setToken(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-yellow-100 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="applicationsStartTime" className="block text-sm font-medium text-white">
          Applications Start Time
        </label>
        <div className="mt-1">
          <DatePicker
            selected={applicationsStartTime}
            onChange={date => setApplicationsStartTime(date)}
            showTimeSelect
            dateFormat="Pp"
            className="custom-datepicker-input mt-1 block w-full px-3 py-2 border border-yellow-100 rounded-md shadow-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="applicationsEndTime" className="block text-sm font-medium text-white">
          Applications End Time
        </label>
        <div className="mt-1">
          <DatePicker
            selected={applicationsEndTime}
            onChange={date => setApplicationsEndTime(date)}
            showTimeSelect
            dateFormat="Pp"
            className="custom-datepicker-input mt-1 block w-full px-3 py-2 border border-yellow-100 rounded-md shadow-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="roundStartTime" className="block text-sm font-medium text-white">
          Round Start Time
        </label>
        <div className="mt-1">
          <DatePicker
            selected={roundStartTime}
            onChange={date => setRoundStartTime(date)}
            showTimeSelect
            dateFormat="Pp"
            className="custom-datepicker-input mt-1 block w-full px-3 py-2 border border-yellow-100 rounded-md shadow-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="roundEndTime" className="block text-sm font-medium text-white">
          Round End Time
        </label>
        <div className="mt-1">
          <DatePicker
            selected={roundEndTime}
            onChange={date => setRoundEndTime(date)}
            showTimeSelect
            dateFormat="Pp"
            className="custom-datepicker-input mt-1 block w-full px-3 py-2 border border-yellow-100 rounded-md shadow-sm"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isMining}
          className="w-full max-w-xs py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          {isMining ? "Creating Round..." : "Create Round"}
        </button>
      </div>
    </form>
  );
};

export default CreateRoundForm;
