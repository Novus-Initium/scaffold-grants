"use client";

import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import type { Project } from "~~/types/grantStack";
import { notification } from "~~/utils/scaffold-eth";
import { ScaffoldWriteContractVariables } from "~~/utils/scaffold-eth/contract";

function formatProjectData(formData: FormData) {
  const projectData: Project = {
    name: (formData.get("name") || "") as string,
    description: (formData.get("description") || "") as string,
    website: (formData.get("website") || "") as string,
  };

  if (!projectData.name || !projectData.description || !projectData.website) {
    console.error("Please fill in all required fields");
    return;
  }

  if (!!formData.get("twitterHandle")) {
    projectData.twitterHandle = (formData.get("twitterHandle") || "") as string;
  }
  if (!!formData.get("githubUsername")) {
    projectData.githubUsername = (formData.get("githubUsername") || "") as string;
  }
  if (!!formData.get("githubOrganization")) {
    projectData.githubOrganization = (formData.get("githubOrganization") || "") as string;
  }
  return projectData;
}

export default function ProjectCreateForm() {
  const { writeContractAsync, isMining } = useScaffoldWriteContract("ProjectRegistry");

  async function createProject(formData: FormData) {
    const projectData = formatProjectData(formData);

    try {
      const metaPtr = {
        protocol: BigInt(1), // Replace with the appropriate protocol value
        pointer: JSON.stringify(projectData),
      };

      const args: ScaffoldWriteContractVariables<"ProjectRegistry", "createProject"> = {
        functionName: "createProject",
        args: [metaPtr],
      };

      const tx = await writeContractAsync(args);

      notification.success(`Project created successfully\n${tx}}`);
    } catch (error: any) {
      notification.error(`Failed to create project: ${error.message}`);
    }
  }

  return (
    <form action={createProject} className=" flex flex-col gap-2 w-full">
      <label className="input input-bordered flex items-center justify-between">
        Name
        <input required name="name" type="text" className="w-9/12" placeholder="Grants stack" />
      </label>
      <label className="input input-bordered flex items-center justify-between">
        Description
        <input required name="description" type="text" className="w-9/12" placeholder="A super cool project" />
      </label>
      <label className="input input-bordered flex items-center justify-between">
        Website
        <input required name="website" type="text" className="w-9/12" placeholder="https://awesome.org" />
      </label>
      <label className="input input-bordered flex items-center justify-between">
        Twitter handle
        <input name="twitterHandle" type="text" className="w-9/12" placeholder="@superman" />
      </label>
      <label className="input input-bordered flex items-center justify-between">
        Github Username
        <input name="githubUsername" type="text" className="w-9/12" placeholder="superman" />
      </label>
      <label className="input input-bordered flex items-center justify-between">
        Github Organization
        <input name="githubOrganization" type="text" className="w-9/12" placeholder="Krypton" />
      </label>

      <button type="submit" className="btn btn-primary mt-4">
        Create
      </button>
    </form>
  );
}
