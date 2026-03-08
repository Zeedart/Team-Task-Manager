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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Projects",
      url: "./projects",
      icon: (
        <RocketIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "Mobile App",
          url: "./projects/mobile-app",
        },
        {
          title: "Web App",
          url: "./projects/web-app",
        },
        {
          title: "Design System",
          url: "./projects/design-system",
        },
        {
          title: "Wireframes",
          url: "./projects/wireframes",
        },
        {
          title: "Documentation",
          url: "./projects/documentation",
        }
      ],
    },
  ],
  dashboard: [
    {
      name: "Home",
      url: "./dashboard",
      icon: (
        <BoxIcon
        />
      ),
    },
  ],
  tasks: [
    {
      name: "Tasks",
      url: "./dashboard/tasks",
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
        <TeamSwitcher teams={data.teams} />
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
