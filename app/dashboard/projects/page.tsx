'use client'
import ProjectCard from "@/components/projectCard"
import Link from "next/link"
import { useState, useEffect } from "react"
import client from "@/api/client"
import { RocketIcon } from "@/components/ui/rocket-icon"
import Image from "next/image"
import NotFoundImg from "../../images/No_Projects_Found.png"
import { Skeleton } from "@/components/ui/skeleton"
import type { Project } from "../data/types"



export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await client.from("projects").select("*")
            if (error) {
                console.error("Error fetching projects:", error)
            } else {
                setProjects(data)
            }
            setLoading(false)
        }

        fetchProjects()
    }, [])

    if (loading) return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-[#172b4d]">Projects</h1>
            <h2 className="text-lg mt-2 ml-6 font-semibold text-gray-500">List of projects</h2>
            <div className="mt-6 ml-6 grid gap-4  md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="border flex w-90 gap-4 flex-col rounded-lg p-6 transition-all duration-200">

                        {/* Title + date */}
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-3/4 bg-gray-300" />   {/* title */}
                            <Skeleton className="h-4 w-1/2 bg-gray-300" />   {/* date */}
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-1/3 bg-gray-300" />              {/* label */}
                            <Skeleton className="h-4 w-full rounded-full bg-gray-300" /> {/* progress bar */}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )


    function onButtonClick() {
        console.log("here we are")
    }

    console.log("PROJECTS:", projects)
    console.log("URLS:", projects.map(p => p.url))

    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center px-140 py-50">
                <div className="text-gray-400 mb-6 text-6xl">
                    <Image src={NotFoundImg} alt="NotFound" width={100} height={100} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No projects yet</h2>
                <p className="text-gray-500 mb-6">Get started by creating your first project.</p>
                <button
                    onClick={onButtonClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    + Create Project
                </button>
            </div>
        )
    }
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-[#172b4d]">Projects</h1>
            <h2 className="text-lg mt-2 ml-6 font-semibold text-gray-500">List of projects</h2>
            <div className="mt-6 ml-6 grid gap-4  md:grid-cols-2 lg:grid-cols-4">
                {projects.map(project => (
                    <Link
                        key={project.id}
                        href={project.url ?? `/dashboard/projects/${project.id}`}
                    >
                        <ProjectCard project={project} />
                    </Link>
                ))}
            </div>
        </div>
    )
}