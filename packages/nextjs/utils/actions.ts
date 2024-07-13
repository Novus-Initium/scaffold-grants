"use server";

import type { Project } from "~~/types/grantStack";

export async function createProject(formData: FormData) {
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

  console.log("projectData => ", projectData);
  // return projectData;
}
