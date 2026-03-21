'use client'
import ProjectCard from "@/components/projectCard"
import Link from "next/link"
import { useState, useEffect } from "react"
import client from "@/api/client"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { RocketIcon } from "@/components/ui/rocket-icon"
import Image from "next/image"
import NotFoundImg from "../../images/No_Projects_Found.png"



export default function Projects() {
    const [projects, setProjects] = useState([])
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


    if (loading) return (
        <SkeletonTheme baseColor="#212033" highlightColor="#v8v6r3">
            <Skeleton />
            <Skeleton className="mt-2 ml-6" />
            <Skeleton className="mt-6 ml-6" />
        </SkeletonTheme>
    )

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