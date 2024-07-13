"use client";

import ProjectCard from "~~/components/ProjectCard";

const initialState = {
  name: "Grants stack",
  description: "A super cool project",
  website: "https://awesome.org",
  twitterHandle: "@superman",
  githubUsername: "superman",
  githubOrganization: "Krypton",
};

const projects = [initialState, initialState, initialState, initialState, initialState];

export default function ProjectsPage() {
  return (
    <main className=" p-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold mb-5">Projects</h2>

        <a role="button" className="btn btn-primary" href="/projects/new">
          Create new project
        </a>
      </div>

      <div className="mt-8 w-full flex flex-wrap justify-center gap-4">
        {projects.map(project => (
          <ProjectCard
            key={project.name}
            name={project.name}
            description={project.description}
            website={project.website}
            twitterHandle={project.twitterHandle}
            githubUsername={project.githubUsername}
            githubOrganization={project.githubOrganization}
          />
        ))}
      </div>
    </main>
  );
}
