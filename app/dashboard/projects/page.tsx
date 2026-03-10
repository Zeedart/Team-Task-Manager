import ProjectCard from "@/components/projectCard"
import {projectRoutes} from "@/app/dashboard/data/projects"
export default function Projects() {


    return (
        <div className="p-6">
                    <h1 className="text-3xl font-bold text-[#172b4d]">Projects</h1>
                    <h2 className="text-lg mt-2 ml-6 font-semibold text-gray-500">List of projects</h2>
                    <div className="mt-6 ml-6 grid gap-4  md:grid-cols-2 lg:grid-cols-4">
                        {projectRoutes.map(project => (
                            <ProjectCard project={project}/>
                        ))}
                    </div>
                    <div className="mt-10 w-full flex">

                    </div>
                </div>
    )
}