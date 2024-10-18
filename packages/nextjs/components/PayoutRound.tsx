"use client";

import React, { useEffect, useState } from "react";
import { encodeRoundParameters, getABI, getNetworkName  } from "../utils/utils";
import { ethers } from "ethers";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type ProjectMetadata = {
  id: number;
  metadata: {
    protocol: string;
    pointer: string;
  };
};

type Round = {
    address: string;
    name: string;
    description: string;
    applicationsStartTime: string;
    applicationsEndTime: string;
    roundStartTime: string;
    roundEndTime: string;
    matchAmount: string;
}

const ExplorePastRounds = () => {
  const [pastRounds, setPastRounds] = useState<any[]>([]);
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Hook to read all projects
  const { data: projectsData, error: projectsError } = useScaffoldReadContract({
    contractName: "ProjectRegistry",
    functionName: "getAllProjects",
  });

  useEffect(() => {
    // Set the provider only on the client side
    if (typeof window !== "undefined" && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  useEffect(() => {
    // Fetch projects
    if (projectsError) {
      setError(projectsError.message);
      setLoading(false);
      return;
    }

    if (projectsData) {
      console.log("Projects Data:", projectsData);
      setProjects(
        projectsData.map((project: any) => ({
          id: Number(project.id),
          metadata: {
            protocol: project.metadata.protocol.toString(),
            pointer: project.metadata.pointer,
          },
        })),
      );
      setLoading(false);
    }
  }, [projectsData, projectsError]);

  useEffect(() => {
    const fetchRounds = async () => {
      if (!provider) return;

      try {
        await provider.send("eth_requestAccounts", []); // Request account access

        const roundFactory = getABI(await getNetworkName(provider), "RoundFactory");
        const contract = new ethers.Contract(roundFactory.address, roundFactory.abi, provider);

        const filter = contract.filters.RoundCreated();
        const events = await contract.queryFilter(filter);

        const roundsMapping: { [key: string]: string } = events.reduce((acc: { [key: string]: string }, event: any) => {
          acc[event.args[3]] = event.args[0]; // Map roundMetaPtrCID to roundAddress
          return acc;
        }, {});

        const details = await Promise.all(
          Object.keys(roundsMapping).map(async ipfsHash => {
            try {
              const response = await fetch(`/api/getPinata/${ipfsHash}`);
              if (!response.ok) throw new Error("Failed to fetch data");
              const data = await response.json();
              return { ipfsHash, ...data, address: roundsMapping[ipfsHash] };
            } catch (err) {
              console.error(`Error fetching data for ${ipfsHash}:`, err);
              return { ipfsHash, error: "Failed to fetch data" };
            }
          }),
        );

        const currentTime = new Date().toISOString();
        const endedRounds = details
          .filter(round => {
            const keyValues = round.options.metadata.keyvalues;
            const roundEndTime = keyValues.roundEndTime;

            return !round.error && roundEndTime < currentTime;
          })
          .map(round => ({
            ...round.options.metadata.keyvalues,
            address: round.address, // Add the address to the round data
          }));

        console.log("Past Rounds:", endedRounds);

        setPastRounds(endedRounds);
      } catch (error: any) {
        console.error(error);
        setError("Error loading rounds");
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, [provider]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const payoutRound = async (round: Round) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log('Round Address', round.address);
    const networkName = await getNetworkName(provider);
    const roundContract = new ethers.Contract(round.address, getABI(networkName, "RoundImplementation").abi, signer);
    roundContract.setReadyForPayout();
  }


  return (
    <div className="explore-rounds-container">
      <h1>Explore Past Rounds</h1>
      
      {/* Define the grid container */}
      <div className="rounds-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastRounds.length === 0 ? (
          <p>No past rounds available.</p>
        ) : (
          pastRounds.map((round, index) => (
            <div key={index} className="card bg-base-100 w-96 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{round.name}</h2>
                <p>{round.description}</p>
                <p>
                  <strong>Application Start Time:</strong>{' '}
                  {new Date(round.applicationsStartTime).toLocaleString()}
                </p>
                <p>
                  <strong>Application End Time:</strong>{' '}
                  {new Date(round.applicationsEndTime).toLocaleString()}
                </p>
                <p>
                  <strong>Round Start Time:</strong>{' '}
                  {new Date(round.roundStartTime).toLocaleString()}
                </p>
                <p>
                  <strong>Round End Time:</strong>{' '}
                  {new Date(round.roundEndTime).toLocaleString()}
                </p>
                <p>
                  <strong>Match Amount (ETH):</strong> {round.matchAmount}
                </p>
                <div className="card-actions justify-end">
                  <details className="dropdown">
                    <summary
                      className="btn m-1"
                      onClick={() => payoutRound(round)} // Trigger payoutRound on click
                    >
                      Setup Payout
                    </summary>
                  </details>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExplorePastRounds;
