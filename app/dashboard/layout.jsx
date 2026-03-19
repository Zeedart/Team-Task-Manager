'use client'

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import useAuth from "@/hooks/useAuth.js"
import { projectRoutes } from "./data/projects.js"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SettingsIcon } from "@/components/ui/settings-icon"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import client from "@/api/client.js"

export default function MainLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();


    // Auth redirect
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/"); // redirect to login
        }
    }, [loading, user, router]);

    // Breadcrumbs
    const breadcrumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, array) => {
            let label = segment.replace(/-/g, " ");
            if (!isNaN(Number(segment))) {
                const project = projectRoutes.find(p => p.id === Number(segment));
                if (project) label = project.title;
            }
            return {
                label,
                href: "/" + array.slice(0, index + 1).join("/"),
            };
        });


    if (loading) return (<SkeletonTheme baseColor="#2382da" highlightColor="#c8387c">
        <div className="w-[20px] h-[20px]">
            <Skeleton height={20} width={20} />
        </div>
    </SkeletonTheme>
    )
    if (!user) return (<SkeletonTheme baseColor="#2382da" highlightColor="#c8387c">
        <div className="w-[20px] h-[20px]">
            <Skeleton height={20} width={20} />
        </div>
    </SkeletonTheme>)

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
                                            <BreadcrumbPage className="text-primary font-semibold">{crumb.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="h-15 border-b border-gray-300 flex p-5 gap-4 items-center">
                    <Popover>
                        <PopoverTrigger render={<Button className="bg-blue-600 hover:bg-blue-700">+ New Project</Button>} />
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div>
                                    <h4 className="font-semibold text-lg">Create Project</h4>
                                    <p className="text-sm text-gray-500">Add a new project to your workspace.</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input id="name" placeholder="Mobile App" value="" />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">Create Project</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
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