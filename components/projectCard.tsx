import {
    Progress, ProgressLabel,
    ProgressValue,
} from "@/components/ui/progress"

import type { Project } from "@/app/dashboard/data/types"
import { tasks } from "@/app/dashboard/data/tasks"

export default function ProjectCard({ project }: Project) {

    //Formula for Progress %:
    //% = (Completed Task / Total tasks) * 100

    const totalTasks = tasks.filter(
        task => task.projectId == project.id
    ).length

    const completedTasks = tasks.filter(
        task => task.projectId == project.id && task.status == "Completed"
    ).length

    const inProgressTasks = tasks.filter(
        task => task.projectId == project.id && task.status == "In Progress"
    ).length

    const inReviewTasks = tasks.filter(
        task => task.projectId == project.id && task.status == "In Review"
    ).length

    const progress =
        (
            (completedTasks * 1) +
            (inReviewTasks * 0.75) +
            (inProgressTasks * 0.5)
        ) / totalTasks * 100

    return (
        <div className="border flex w-90 gap-2 flex-col rounded-lg p-6">
            <div>
                <h1 className="font-semibold text-lg text-[#172b4d]">{project.title}</h1>
                <h2 className="text-gray-500 text-sm">{project.createdOn}</h2>
            </div>
            <div>
                <Progress value={progress} className="w-full max-w-sm">
                    <ProgressLabel>Completed</ProgressLabel>
                    <ProgressValue />
                </Progress>
            </div>
        </div>
    )
}