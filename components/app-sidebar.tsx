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
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"
import { BoxIcon } from "@/components/ui/box-icon"
import { LayersIcon } from "@/components/ui/layers-icon"
import { RocketIcon } from "@/components/ui/rocket-icon"
import { projectRoutes  } from "../app/dashboard/data/projects.js"
import LOGO from "@/images/LOGO.svg"
import Image from 'next/image';

// This is sample data.
const data = { 
  user: {
    id: 1,
    username: "John Doe",
    email: "m@example.com",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  navMain: [
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: (
        <RocketIcon
        />
      ),
      isActive: true,
      items: projectRoutes
    },
  ],
  dashboard: [
    {
      name: "Home",
      url: "/dashboard",
      icon: (
        <BoxIcon
        />
      ),
    },
  ],
  tasks: [
    {
      name: "Tasks",
      url: "/dashboard/tasks",
      icon: (
        <LayersIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="ml-5 flex space-x-10 items-center-safe">
          <Image src={LOGO} alt="logo" width={37} height={35}/>
          <p className="font-bold text-[30px] text-[#172b4d]">Taskora</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects items={data.dashboard} />
        <NavMain items={data.navMain} />
        <NavProjects items={data.tasks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
