import {projectRoutes} from "@/app/dashboard/data/projects"
import ProjectBoard from "@/components/projectBoard"
import {tasks} from "@/app/dashboard/data/tasks"

export default async function ProjectDetails({
  params,
}: {
  params: { projectID: string };
}) {
  // Await params if it is a promise
  const resolvedParams = await params;
  const projectID = resolvedParams.projectID;

  const project = projectRoutes.find(
    (project) => project.id === parseInt(projectID)
  );
  const currentuser = 1

  const curUserTasks = tasks.filter(
    task => task.assignedTo == currentuser && task.projectId == project?.id && task.status != "Completed"
  )

  const projectTasks = tasks.filter(
    task => task.projectId == project?.id
  )

  if (!project) {
    console.log(projectID);
    return <div>Project not found</div>;
  }

  const { id, title, url, createdOn } = project;
  const pending = projectTasks.filter(
    task => task.status == "In Review"
  )

  const inProgress = projectTasks.filter(
    task => task.status == "In Progress"
  )

  const completed = projectTasks.filter(
    task => task.status == "Completed"
  )

  return (
    <div className="p-6">
      <header>
        <h1 className="text-3xl ml-2 font-bold text-[#172b4d]">{title}</h1>
        <h2 className="text-lg mt-2 mb-5 ml-6 font-semibold text-gray-700">
          {createdOn}
        </h2>
        <hr className="border border-gray-200" />
      </header>
      <div className="mt-6 w-full ml-6 grid gap-4 h-60 md:grid-cols-2 lg:grid-cols-5">
        <ProjectBoard status="To do" tasks={curUserTasks} />
        <ProjectBoard status="In Progress" tasks={inProgress} />
        <ProjectBoard status="In Review" tasks={pending} />
        <ProjectBoard status="Completed" tasks={completed} />
      </div>
    </div>
  );
}