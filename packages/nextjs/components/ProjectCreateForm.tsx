"use client";

export default function ProjectCreateForm({ createProject }: { createProject: (formData: FormData) => Promise<void> }) {
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
