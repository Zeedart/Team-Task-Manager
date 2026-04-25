"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, User } from "lucide-react"
import { BoxIcon } from "@/components/ui/box-icon"
import { LayersIcon } from "@/components/ui/layers-icon"
import { RocketIcon } from "@/components/ui/rocket-icon"
import LOGO from "@/app/images/LOGO.svg"
import Image from 'next/image';
import { useEffect, useState } from "react"
import type { Project, Users } from "@/app/dashboard/data/types.js"
import client from "@/api/client.js"
import { Skeleton } from "@/components/ui/skeleton"


// This is sample data.

export function AppSidebar({
  projects: externalProjects,          // 👈 new prop
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projects?: Project[];                // 👈 typed as optional
}) {

  const [users, setUsers] = useState<Users[]>([])
  const [userLoading, setUserLoading] = useState(true)



  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await client.from("users").select("*")

      if (error) {
        console.log("Failed to Fetch Users")
      } else {
        setUsers(data)
      }

      setUserLoading(false)
    }

    fetchUsers()
  }, [])

  const [currentUserData, setCurrentUserData] = useState<Users | null>(null)

  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user }, error } = await client.auth.getUser()

      if (error) {
        console.log("Error getting user:", error)
      } else if (user) {
        setCurrentUserData(users.find((userItem) => userItem.id === user.id) || null)
        console.log("USERDATA : ", currentUserData)
      }
    }

    getCurrentUser()
  }, [users]) // Re-run when users array loads


  const navMain = [
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: (
        <RocketIcon
        />
      ),
      isActive: true,
      items: externalProjects ?? []
    }]

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
        <div className="ml-5 flex space-x-10 items-center-safe">
          <Image src={LOGO} alt="logo" width={37} height={35} />
          <p className="font-bold text-[30px] text-[#172b4d]">Taskora</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects items={dashboard} />
        <NavMain items={navMain} />
        <NavProjects items={tasks} />
      </SidebarContent>
      <SidebarFooter>
        {currentUserData ? (
          <NavUser user={currentUserData} />
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
