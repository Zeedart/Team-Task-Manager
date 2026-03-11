"use client"

import Link from "next/link"
import { SettingsIcon } from "@/components/ui/settings-icon"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { projectRoutes } from "./data/projects.js"
import { tasks } from "./data/tasks.js"
import { usePathname } from "next/navigation"
import LOGO from "@/images/LOGO.svg"
import { BoxIcon } from "@/components/ui/box-icon"
import React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import type { Project } from "@/app/dashboard/data/types.js"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const segments = pathname
        .split("/")
        .filter(Boolean)


    const labels: Record<string, string> = {
        dashboard: "Home",
        projects: "Projects",
        tasks: "Tasks",
    }

    const breadcrumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, array) => {
            let label = segment.replace(/-/g, " ");

            // Check if the segment is a number (dynamic project ID)
            if (!isNaN(Number(segment))) {
                const project = projectRoutes.find(p => p.id === Number(segment));
                if (project) {
                    label = project.title; // Replace ID with project title
                }
            }

            return {
                label,
                href: "/" + array.slice(0, index + 1).join("/"),
            };
        });

    const [projects, setProjects] = useState(projectRoutes)

    function addProject(project: Project) {
        setProjects([...projects, project])
        console.log(projects)
    }

    const [title, setTitle] = useState("")

    function handleCreate() {
        if (!title) return

        const newProject = {
            id: projectRoutes.length + 1,
            title: title,
            url: `/dashboard/projects/${projectRoutes.length + 1}`,
            createdOn: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        }

        addProject(newProject)
        setTitle("")
    }


    return (
        <div>
            <header className="h-15 ml-76.5 w-[83%] bg-red border-b border-gray-300 flex justify-between items-center">
                <div className="ml-5">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.href}>
                                    <BreadcrumbItem>

                                        {index === breadcrumbs.length - 1 ? (
                                            <BreadcrumbPage>
                                                {crumb.label}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                render={<Link href={crumb.href} />}
                                            >
                                                {crumb.label}
                                            </BreadcrumbLink>
                                        )}

                                    </BreadcrumbItem>

                                    {index < breadcrumbs.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="h-15 border-b border-gray-300 flex p-5 gap-4 items-center">
                    <div className="m-0 p-0 relative">
                        <Popover>
                            <PopoverTrigger>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    + New Project
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div>
                                        <h4 className="font-semibold text-lg">Create Project</h4>
                                        <p className="text-sm text-gray-500">
                                            Add a new project to your workspace.
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Project Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Mobile App"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700">
                                        Create Project
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <SettingsIcon size={30} className="hover:text-[#1868db] transition-colors duration-500" />
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Profile Picture" className="w-10 h-10 rounded-full" />
                </div>
            </header>
            <div className="flex h-full w-full">
                <SidebarProvider>
                    <AppSidebar />
                </SidebarProvider>

                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}
