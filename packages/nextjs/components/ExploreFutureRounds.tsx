"use client";

import React, { useEffect, useState } from "react";
import { encodeRoundParameters, getABI, getNetworkName  } from "../utils/utils";
import { applyToRound } from "../utils/allo/applyToRound";
import parsePointer from "../utils/allo/parsePointer";
import { ethers } from "ethers";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type ProjectMetadata = {
  id: number;
  metadata: {
    protocol: string;
    pointer: string;
  };
};

const ExploreFutureRounds = () => {
  const [futureRounds, setFutureRounds] = useState<any[]>([]);
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
        const future = details
          .filter(round => {
            const keyValues = round.options.metadata.keyvalues;
            const applicationsStartTime = keyValues.applicationsStartTime;
            const applicationsEndTime = keyValues.applicationsEndTime;

            return !round.error && applicationsStartTime <= currentTime && applicationsEndTime >= currentTime;
          })
          .map(round => ({
            ...round.options.metadata.keyvalues,
            address: round.address, // Add the address to the round data
          }));

        console.log("Future Rounds:", future);

        setFutureRounds(future);
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
  return (
    <div className="explore-rounds-container">
      <h1>Explore Future Rounds</h1>
      <div className="rounds-grid">
        {futureRounds.length === 0 ? (
          <p>No future rounds available.</p>
        ) : (
          futureRounds.map((round, index) => (
            <div key={index} className="card bg-base-100 w-96 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{round.name}</h2>
                <p>{round.description}</p>
                <p>
                  <strong>Application Start Time:</strong> {new Date(round.applicationsStartTime).toLocaleString()}
                </p>
                <p>
                  <strong>Application End Time:</strong> {new Date(round.applicationsEndTime).toLocaleString()}
                </p>
                <p>
                  <strong>Round Start Time:</strong> {new Date(round.roundStartTime).toLocaleString()}
                </p>
                <p>
                  <strong>Round End Time:</strong> {new Date(round.roundEndTime).toLocaleString()}
                </p>
                <p>
                  <strong>Match Amount ($ERC20):</strong> {round.matchAmount}
                </p>
                <div className="card-actions justify-end">
                  <details className="dropdown">
                    <summary className="btn m-1">Apply to Round</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                      {projects.map(project => {
                        const pointerData = parsePointer(project.metadata.pointer);
                        return (
                          <li key={project.id}>
                            <a
                              onClick={async () => {
                                console.log(`Applying ${pointerData.name || `Project ${project.id}`} to ${round.name}`);
                                try {
                                  await applyToRound(
                                    provider,
                                    round.address.toString(),
                                    project.id,
                                    project.metadata.pointer,
                                  );
                                  console.log(
                                    `Successfully applied ${pointerData.name || `Project ${project.id}`} to ${round.name}`,
                                  );
                                } catch (error) {
                                  console.error("Error applying to round:", error);
                                }
                              }}
                            >
                              {pointerData.name || `Project ${project.id}`}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
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

export default ExploreFutureRounds;
