"use client"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

import type { Project, Tasks } from "@/app/dashboard/data/types"
import { format, parseISO } from "date-fns"
import client from "@/api/client"
import { useState, useEffect } from "react"

type Props = {
  project: Project
}

export default function ProjectCard({ project }: Props) {

  // ----------------------------
  // DATE FORMAT (SAFE)
  // ----------------------------
  const formatted = project.createdOn
    ? format(parseISO(project.createdOn), "dd MMM yyyy")
    : ""

  // ----------------------------
  // TASKS STATE
  // ----------------------------
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function fetchTasks() {
    const { data, error } = await client
      .from("tasks")
      .select("*")
      .eq("projectId", project.id);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }

    setLoading(false);
  }

  fetchTasks();
}, [project.id]); 


  // ----------------------------
  // FILTER TASKS FOR THIS PROJECT
  // ----------------------------
  const projectTasks = tasks; 

  const totalTasks = projectTasks.length

  const completedTasks = projectTasks.filter(
    task => task.status === "Completed"
  ).length

  const inProgressTasks = projectTasks.filter(
    task => task.status === "In Progress"
  ).length

  const inReviewTasks = projectTasks.filter(
    task => task.status === "In Review"
  ).length

  // ----------------------------
  // PROGRESS (SAFE)
  // ----------------------------
  const progress =
    totalTasks === 0
      ? 0
      : ((completedTasks * 1) +
         (inReviewTasks * 0.75) +
         (inProgressTasks * 0.5)) /
        totalTasks *
        100

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="border flex w-90 gap-2 flex-col rounded-lg p-6 transition-all duration-200 cursor-pointer
      hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 bg-white">

      <div>
        <h1 className="font-semibold text-lg text-[#172b4d]">
          {project.title}
        </h1>

        <h2 className="text-gray-500 text-sm">
          {formatted}
        </h2>
      </div>

      <div>
        <Progress value={progress} className="w-full max-w-sm">
          <ProgressLabel>Progress</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
    </div>
  )
}