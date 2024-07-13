import ProjectCreateForm from "~~/components/ProjectCreateForm";

export default function NewProjectPage() {
  return (
    <main className="p-10">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">New project</h2>

          <div className="card-actions flex flex-col">
            <ProjectCreateForm />
          </div>
        </div>
      </div>
    </main>
  );
}
