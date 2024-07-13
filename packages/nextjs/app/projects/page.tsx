"use client";

import ProjectCard from "~~/components/ProjectCard";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import type { Project } from "~~/types/grantStack";

export default function ProjectsPage() {
  const { data } = useScaffoldReadContract({
    contractName: "ProjectRegistry",
    functionName: "getAllProjects",
  });

  const projects =
    data?.map(project => {
      const metadata = JSON.parse(project.metadata.pointer) as Project;

      return {
        id: project.id,
        name: metadata.name,
        description: metadata.description,
        website: metadata.website,
        twitterHandle: metadata.twitterHandle,
        githubUsername: metadata.githubUsername,
        githubOrganization: metadata.githubOrganization,
      };
    }) || [];

  return (
    <main className="p-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold mb-5">Projects</h2>

        <a role="button" className="btn btn-primary" href="/projects/new">
          Create new project
        </a>
      </div>

      <div className="mt-8 w-full flex flex-wrap justify-center gap-4">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              website={project.website}
              twitterHandle={project.twitterHandle}
              githubUsername={project.githubUsername}
              githubOrganization={project.githubOrganization}
            />
          ))
        ) : (
          <div>No projects to show</div>
        )}
      </div>
    </main>
  );
}
