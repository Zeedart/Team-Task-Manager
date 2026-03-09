"use client"

import Link from "next/link"
import { SettingsIcon } from "@/components/ui/settings-icon"
import { Button } from "@/components/ui/button"
import { routes } from "./data/routes.js"
import { projectRoutes } from "./data/projects.js"
import { tasks } from "./data/tasks.js"
import { usePathname } from "next/navigation"
import LOGO from "@/images/LOGO.svg"
import { BoxIcon } from "@/components/ui/box-icon"
import React from "react"


//{routes.map(route => (
//<li key={route.id} className="text-lg font-medium text-[#172b4d] hover:text-[#1868db] cursor-pointer">
//  <Link key={route.id} href={route.path}>
//    {route.name}
// </Link>
//</li>
//))}


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
        .map((segment, index, array) => ({
            label: segment.replace(/-/g, " "),
            href: "/" + array.slice(0, index + 1).join("/"),
        }))


    return (
        <div>
            <header className="h-15 ml-76.5 w-[83%] bg-red border-b border-gray-300 flex justify-between items-center">
                <div className="ml-5">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.href}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={crumb.href}>
                                            {crumb.label}
                                        </BreadcrumbLink>
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
                    <Button>+ Create Project</Button>
                    <SettingsIcon size={30} className="hover:text-[#1868db] transition-colors duration-500" />
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Profile Picture" className="w-10 h-10 rounded-full" />
                </div>
            </header>
            <div className="flex h-full w-full">
                <SidebarProvider>
                    <AppSidebar />
                </SidebarProvider>

                <main>{children}</main>
            </div>
        </div>
    )
}
