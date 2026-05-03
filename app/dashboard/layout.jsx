'use client'

import Link from "next/link"
import React, { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"
import useAuth from "@/hooks/useAuth.js"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { SettingsIcon } from "@/components/ui/settings-icon"
import client from "@/api/client.js"
import { LoaderCircleIcon } from "@/components/ui/loader-circle-icon"
import AvatarUpload from "@/components/pfp/avatarUpload.tsx"
import handleNewActivity from "@/lib/handleActivityLog.jsx"
import { WorkspaceProvider, useWorkspace } from "./context/WorkspaceContext"

// ----------------------------------------------------------------------
// Outer component – only provides the workspace context
// ----------------------------------------------------------------------
export default function MainLayout({ children }) {
  return (
    <WorkspaceProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </WorkspaceProvider>
  )
}

// ----------------------------------------------------------------------
// Inner component – all logic that needs useWorkspace()
// ----------------------------------------------------------------------
function MainLayoutContent({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const workspaceId = useWorkspace()                // ✅ now safely inside the provider
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [title, setTitle] = useState("")
  const [inputLoading, setInputLoading] = useState(false)

  // ----------------------------
  // FETCH WORKSPACE MEMBERS (scoped user list)
  // ----------------------------
  useEffect(() => {
    async function fetchMembers() {
      if (!workspaceId) return
      const { data, error } = await client
        .from("workspace_members")
        .select("user_id, users(*)")
        .eq("workspace_id", workspaceId)

      if (!error) {
        setUsers(data.map(m => m.users))
      } else {
        console.error("Failed to fetch workspace members:", error)
      }
    }
    fetchMembers()
  }, [workspaceId])

  // ----------------------------
  // AUTH REDIRECT
  // ----------------------------
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/")
    }
  }, [loading, user, router])

  const currentUser = useMemo(() => {
    return users.find(u => u.id === user.id)
  }, [users, user])

  // ----------------------------
  // HANDLE DELETE PROJECT
  // ----------------------------
  async function handleDeleteProject(projectId) {
    const projectTitle =
      projects.find(p => p.id === projectId)?.title || "Unknown Project"
    const { error } = await client
      .from("projects")
      .delete()
      .eq("id", projectId)

    if (error) {
      toast.error("Failed to delete project:", error)
    } else {
      setProjects(prev => prev.filter(p => p.id !== projectId))
      toast.success("Project deleted successfully!")
      await handleNewActivity(
        `<strong>${projectTitle}</strong> was permanently removed by <strong>${currentUser?.username}</strong>`,
        currentUser,
        workspaceId
      )
    }
  }

  // ----------------------------
  // FETCH PROJECTS (workspace scoped)
  // ----------------------------
  useEffect(() => {
    async function fetchProjects() {
      if (!workspaceId) return
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("workspace_id", workspaceId)

      if (error) {
        console.error("Failed to fetch projects:", error)
      } else {
        setProjects(data || [])
      }
    }
    fetchProjects()
  }, [workspaceId])

  // ----------------------------
  // FAST LOOKUP MAP
  // ----------------------------
  const projectMap = useMemo(() => {
    return Object.fromEntries(projects.map(p => [String(p.id), p.title]))
  }, [projects])

  // ----------------------------
  // BREADCRUMBS
  // ----------------------------
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      let label = segment.replace(/-/g, " ")
      if (!isNaN(Number(segment))) {
        label = projectMap[segment] || label
      }
      return {
        label,
        href: "/" + array.slice(0, index + 1).join("/"),
      }
    })

  // ----------------------------
  // CREATE PROJECT
  // ----------------------------
  async function handleCreateProject() {
    setInputLoading(true)

    if (!title.trim()) {
      toast.error("Project name cannot be empty.")
      setInputLoading(false)
      return
    }

    const { data, error } = await client
      .from("projects")
      .insert([
        {
          title,
          user_id: user.id,
          workspace_id: workspaceId,            // ✅ scoped to workspace
        },
      ])
      .select()

    if (error) {
      toast.error("Error creating project:", error)
    } else {
      setProjects(prev => [...prev, data[0]])
      setTitle("")
      toast.success("Project created successfully!")
      await handleNewActivity(
        `<strong>${currentUser.username}</strong> created a new project <strong>${data[0].title}</strong>`,
        currentUser,
        workspaceId
      )
    }
    setInputLoading(false)
  }

  // --------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------
  return (
    <div>
      {/* HEADER */}
      <header className="h-15 ml-76.5 w-[83%] border-b border-gray-300 flex justify-between items-center">
        {/* BREADCRUMBS */}
        <div className="ml-5">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-primary font-semibold">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* ACTIONS */}
        <div className="flex p-5 gap-4 items-center">
          <Popover>
            <PopoverTrigger asChild>
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
                  <Label>Project Name</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project name"
                  />
                </div>
                <Button
                  onClick={handleCreateProject}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={inputLoading || !title.trim()}
                >
                  {inputLoading ? (
                    <LoaderCircleIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    "+ Create Project"
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {currentUser ? (
            <div className="flex p-5 gap-4 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <img
                    src={currentUser?.avatar_url}
                    className="w-10 h-10 rounded-full"
                    alt="profile"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <AvatarUpload
                    userId={currentUser.id}
                    currentUrl={currentUser.avatar_url}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <LoaderCircleIcon className="w-10 h-10 animate-spin" />
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="flex h-full w-full">
        <SidebarProvider>
          <AppSidebar projects={projects} onDeleteProject={handleDeleteProject} />
        </SidebarProvider>
        <main>{children}</main>
      </div>
    </div>
  )
}