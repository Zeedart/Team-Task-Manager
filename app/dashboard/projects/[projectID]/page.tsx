"use client"

import ProjectBoard from "@/components/projectBoard"
import { useState, useEffect } from "react"
import client from "@/api/client"
import type { Project, Tasks } from "../../data/types"
import type { User } from "@supabase/supabase-js"
import { useParams } from "next/navigation"
import { format, parseISO } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function ProjectDetails() {
  const { projectID } = useParams<{ projectID: string }>()

  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)



  const handleDeleteTask = async (taskId: number) => {
    const { error } = await client
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to delete task");
      throw error; // Let the child know it failed
    }

    // Remove from state (animation has already finished in the child)
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success("Task deleted");
  };


  // Get logged-in user
  useEffect(() => {
    async function getUser() {
      const { data, error } = await client.auth.getUser()

      if (error) {
        console.error(error)
      } else {
        setUser(data.user)
      }
    }

    getUser()
  }, [])

  // Fetch projects + tasks
  useEffect(() => {
    async function fetchData() {
      const [projectsRes, tasksRes] = await Promise.all([
        client.from("projects").select("*"),
        client.from("tasks").select("*"),
      ])

      if (projectsRes.error || tasksRes.error) {
        console.error(
          "Error fetching:",
          projectsRes.error || tasksRes.error
        )
      } else {
        setProjects(projectsRes.data ?? [])
        setTasks(tasksRes.data ?? [])
      }

      setLoading(false)
    }

    fetchData()
  }, [])


  const handleAddTask = async () => {
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("projectId", Number(projectID));   // or fetch all if you prefer

  if (!error) {
    setTasks(data ?? []);
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="p-6 h-[30%] w-[80%]">
        <header>
          {/* Title */}
          <Skeleton className="h-14  w-90 bg-gray-200 ml-2" />

          {/* Subtitle */}
          <Skeleton className="h-9 w-50 mt-3 bg-gray-200 mb-5 ml-6" />

        </header>

        {/* Boards */}
        <div className="mt-18 ml-10 gap-4 flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-85 h-60 rounded-lg border bg-gray-100 bg-card text-card-foreground flex flex-col">

              {/* Header */}
              <header className="w-full flex justify-between bg-gray-200 items-center px-3 py-2">
                <div className="flex gap-3 items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-6" />
                </div>

                <Skeleton className="h-6 w-6 rounded" />
              </header>

              {/* Tasks list */}
              <div className="flex-1 px-2 bg-gray-200 pb-3 overflow-hidden">
                <ol className="flex flex-col gap-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <li key={i}>
                      <Skeleton className="h-30 w-full rounded-md" />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

    )
  }

  // Find current project
  const project = projects.find(
    (project) => project.id === Number(projectID)
  )

  // Not found state
  if (!project) {
    return <div>Project not found</div>
  }

  const currentUserId = user?.id

  // Project tasks
  const projectTasks = tasks.filter(
    (task) => task.projectId === project.id
  )

  // User tasks (not completed)
  const curUserTasks = tasks.filter(
    (task) =>
      task.assignedTo === currentUserId &&
      task.projectId === project.id &&
      task.status !== "Completed"
  )

  // Split by status
  const inReview = projectTasks.filter(
    (task) => task.status === "In Review"
  )

  const inProgress = projectTasks.filter(
    (task) => task.status === "In Progress"
  )

  const completed = projectTasks.filter(
    (task) => task.status === "Completed"
  )

  const { title, createdOn } = project

  const datestr = new Date(createdOn)
  const formatted = datestr
    ? format(parseISO(createdOn), 'dd MMM yyyy')
    : ''

  return (
    <div className="p-6">
      <header>
        <h1 className="text-3xl ml-2 font-bold text-[#172b4d]">
          {title}
        </h1>
        <h2 className="text-lg mt-2 mb-5 ml-6 font-semibold text-gray-700">
          {formatted}
        </h2>
        <hr className="border border-gray-200" />
      </header>

      <div className="mt-6 w-full ml-6 grid gap-4 h-60 md:grid-cols-2 lg:grid-cols-5">
        <ProjectBoard status="To do" tasks={curUserTasks} projectID={projectID} onTaskCreated={handleAddTask} onDeleteTask={handleDeleteTask} />
        <ProjectBoard status="In Progress" tasks={inProgress} projectID={projectID} onTaskCreated={handleAddTask} onDeleteTask={handleDeleteTask} />
        <ProjectBoard status="In Review" tasks={inReview} projectID={projectID} onTaskCreated={handleAddTask} onDeleteTask={handleDeleteTask} />
        <ProjectBoard status="Completed" tasks={completed} projectID={projectID} onTaskCreated={handleAddTask} onDeleteTask={handleDeleteTask} />
      </div>

    </div>
  )
}