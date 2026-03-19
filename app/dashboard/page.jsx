"use client"
import { DataCard } from "@/components/data-card";
//import { projectRoutes } from "./data/projects";
import RecentActivityComp from "@/components/recentActivityComp";
import { recentActivity } from "./data/recentActivity";
//import { tasks } from "./data/tasks";
import MyTasks from "@/components/myTasks";
import client from "@/api/client"
import { useState, useEffect } from "react";

export default function MainDashboard() {
    const [projects, setProjects] = useState([])
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const [projectsRes, tasksRes, usersRes] = await Promise.all([
                client.from("projects").select("*"),
                client.from("tasks").select("*"),
                client.from("users").select("*")
            ])

            if (projectsRes.error || tasksRes.error || usersRes) {
                console.error(
                    "Error fetching:",
                    projectsRes.error || tasksRes.error || usersRes
                )
            } else {
                setProjects(projectsRes.data)
                setTasks(tasksRes.data)
                setUsers(usersRes.data)
            }

            setLoading(false)
        }

        fetchData()
    }, [])

    
    const totalProjects = projects.length;

    const currentuser = 1

    const totalUserTasks = tasks.filter(
        task => task.assignedTo == currentuser && task.status != "Completed"
    ).length

    const totalTaskCompleted = tasks.filter(
        task => task.assignedTo == currentuser && task.status == "Completed"
    ).length

    const curUserTasks = tasks.filter(
        task => task.assignedTo == currentuser && task.status == "In Progress"
    )


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-[#172b4d]">Dashboard</h1>
            <h2 className="text-lg mt-2 ml-6 font-semibold text-gray-700">Overview</h2>
            <div className="mt-6 ml-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DataCard title="Total Projects" value={totalProjects} />
                <DataCard title="Total Tasks" value={tasks.length} />
                <DataCard title="Tasks Assigned to me" value={totalUserTasks} />
                <DataCard title="Tasks Completed" value={totalTaskCompleted} />
            </div>
            <div className="mt-10 w-full flex">
                <RecentActivityComp recentActivity={recentActivity} />
                <MyTasks tasks={curUserTasks} />
            </div>
        </div>
    );
}