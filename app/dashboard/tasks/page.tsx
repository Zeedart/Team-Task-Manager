"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useState, useEffect } from "react"
import client from "@/api/client"
import type { Project, Tasks, Users } from "../data/types"

export default function Tasks() {

    const [projects, setProjects] = useState<Project[]>([])
    const [tasks, setTasks] = useState<Tasks[]>([])
    const [users, setUsers] = useState<Users[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
            async function fetchData() {
                const [projectsRes, tasksRes, usersRes] = await Promise.all([
                    client.from("projects").select("*"),
                    client.from("tasks").select("*"),
                    client.from("users").select("*"),
                ])
    
                if (projectsRes.error || tasksRes.error || usersRes.error ) {
                    console.error(
                        "Error fetching:",
                        projectsRes.error || tasksRes.error || usersRes.error 
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
    

    const statusStyles = {
        "To do": {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-300",
        },
        "In Review": {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-300",
        },
        "In Progress": {
            bg: "bg-purple-100",
            text: "text-purple-800",
            border: "border-purple-300",
        },
        "Completed": {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-300",
        },
    };

    return (
        <div className="p-6 w-full">
            <h1 className="text-3xl font-bold text-[#172b4d]">Tasks</h1>
            <h2 className="text-lg mt-2 ml-6 font-semibold text-gray-500">List of Tasks</h2>
            <div className="w-full mt-6 ml-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">task</TableHead>
                            <TableHead className="w-[200px]">Status</TableHead>
                            <TableHead className="w-[200px]">Project</TableHead>
                            <TableHead>Assigned to</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.title}</TableCell>
                                <TableCell><span className={`rounded px-3 py-2 text-[12px] font-semibold 
                                      ${statusStyles[task.status].bg
                                    } ${statusStyles[task.status].text} ${statusStyles[task.status].border}`}>
                                    {task.status}
                                </span></TableCell>
                                <TableCell>
                                    {projects.find(project => task.projectId === project.id)?.title}
                                </TableCell>
                                <TableCell>{users.find(user => task.assignedTo === user.id)?.username}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}