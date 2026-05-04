"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BoxIcon } from "@/components/ui/box-icon"
import { LayersIcon } from "@/components/ui/layers-icon"
import { RocketIcon } from "@/components/ui/rocket-icon"
import LOGO from "@/app/images/LOGO.svg"
import Image from 'next/image';
import type { Project, Users } from "@/app/dashboard/data/types.js"
import { Skeleton } from "@/components/ui/skeleton"


export function AppSidebar({
  projects: externalProjects,
  onDeleteProject,
  currentUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projects?: Project[];
  onDeleteProject: (projectId: number | string) => Promise<void>;
  currentUser: Users | null;
}) {


  const navMain = [
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: <RocketIcon />,
    isActive: true,
    items: (externalProjects ?? []).map(p => ({
      ...p,
      url: `/dashboard/projects/${p.id}`,
    }))
  }
]

  const dashboard = [
    {
      name: "Home",
      url: "/dashboard",
      icon: (
        <BoxIcon
        />
      ),
    }]

  const tasks = [
    {
      name: "Tasks",
      url: "/dashboard/tasks",
      icon: (
        <LayersIcon
        />
      ),
    }]


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-1 overflow-hidden">
          <Image
            src={LOGO}
            alt="logo"
            width={37}
            height={35}
            className="shrink-0"
          />
          <span className="font-bold text-[20px] text-[#172b4d] truncate transition-opacity duration-200
      opacity-100 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:w-0">
            Taskora
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects items={dashboard} />
        <NavMain items={navMain} onDeleteProject={onDeleteProject} />
        <NavProjects items={tasks} />
      </SidebarContent>
      <SidebarFooter>
        {currentUser ? (
          <NavUser user={currentUser} />
        ) : (
          // optional: loading skeleton
          <div className="p-4 flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-300">
              <Skeleton className="h-full w-full rounded-full bg-gray-200" />
            </div>
            <div className="grid space-y-2 flex-1 leading-tight">
              <Skeleton className="h-4 w-[100px] bg-gray-200" />
              <Skeleton className="h-4 w-[80px] bg-gray-200" />
            </div>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
