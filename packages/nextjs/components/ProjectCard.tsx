import type { Project } from "~~/types/grantStack";

export default function ProjectCard({
  name,
  description,
  website,
  twitterHandle,
  githubUsername,
  githubOrganization,
}: Project) {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          {/* <button className="btn btn-primary">XXXXXXXXXXXXXX</button> */}
        </div>
      </div>
    </div>
  );
}
