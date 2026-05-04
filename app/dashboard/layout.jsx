'use client'

import Link from "next/link"
import React, { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"
import useAuth from "@/hooks/useAuth.js"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import client from "@/api/client.js"
import { LoaderCircleIcon } from "@/components/ui/loader-circle-icon"
import AvatarUpload from "@/components/pfp/avatarUpload.tsx"
import handleNewActivity from "@/lib/handleActivityLog.jsx"
import { WorkspaceProvider, useWorkspace } from "./context/WorkspaceContext"
import { PlusIcon } from "@/components/ui/plus-icon"
export default function MainLayout({ children }) {
  return (
    <WorkspaceProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </WorkspaceProvider>
  )
}

function MainLayoutContent({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const workspaceId = useWorkspace()
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [title, setTitle] = useState("")
  const [inputLoading, setInputLoading] = useState(false)

  useEffect(() => {
    async function fetchMembers() {
      if (!workspaceId) return
      const { data, error } = await client
        .from("workspace_members")
        .select("user_id, users(*)")
        .eq("workspace_id", workspaceId)
      if (!error) setUsers(data.map(m => m.users))
      else console.error("Failed to fetch workspace members:", error)
    }
    fetchMembers()
  }, [workspaceId])

  useEffect(() => {
    if (!loading && !user) router.replace("/")
  }, [loading, user, router])

  const currentUser = useMemo(() => {
    if (!user || !users.length) return null
    return users.find(u => u.id === user.id) ?? null
  }, [users, user])

  useEffect(() => {
    async function fetchProjects() {
      if (!workspaceId) return
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("workspace_id", workspaceId)
      if (error) console.error("Failed to fetch projects:", error)
      else setProjects(data || [])
    }
    fetchProjects()
  }, [workspaceId])

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map(p => [String(p.id), p.title])),
    [projects]
  )

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => ({
      label: !isNaN(Number(segment))
        ? (projectMap[segment] || segment.replace(/-/g, " "))
        : segment.replace(/-/g, " "),
      href: "/" + array.slice(0, index + 1).join("/"),
    }))

  async function handleDeleteProject(projectId) {
    const projectTitle = projects.find(p => p.id === projectId)?.title || "Unknown Project"
    const { error } = await client.from("projects").delete().eq("id", projectId)
    if (error) {
      toast.error("Failed to delete project.")
    } else {
      setProjects(prev => prev.filter(p => p.id !== projectId))
      toast.success("Project deleted successfully!")
      await handleNewActivity(
        `<strong>${projectTitle}</strong> was permanently removed by <strong>${currentUser?.username}</strong>`,
        currentUser, workspaceId
      )
    }
  }

  async function handleCreateProject() {
    setInputLoading(true)
    if (!title.trim()) {
      toast.error("Project name cannot be empty.")
      setInputLoading(false)
      return
    }
    const { data, error } = await client
      .from("projects")
      .insert([{ title, user_id: user.id, workspace_id: workspaceId }])
      .select()
    if (error) {
      toast.error("Error creating project.")
    } else {
      setProjects(prev => [...prev, data[0]])
      setTitle("")
      toast.success("Project created successfully!")
      await handleNewActivity(
        `<strong>${currentUser.username}</strong> created a new project <strong>${data[0].title}</strong>`,
        currentUser, workspaceId
      )
    }
    setInputLoading(false)
  }

  return (
    // ✅ SidebarProvider wraps everything so header trigger + sidebar share context
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        <AppSidebar projects={projects} onDeleteProject={handleDeleteProject} currentUser={currentUser} />

        {/* Right side: header + page content stacked vertically */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* HEADER — no hardcoded margin/width, grows naturally */}
          <header className="h-15 border-b border-gray-300 flex justify-between items-center px-4 shrink-0">
            <div className="flex items-center gap-3">
              {/* ✅ Trigger now inside SidebarProvider context */}
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage className="text-primary font-semibold capitalize">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink render={<Link href={crumb.href} />} className="capitalize">
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex gap-4 items-center">
              <Popover>
                <PopoverTrigger
                  render={
                    <button className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 cursor-pointer text-sm font-medium
      p-2 rounded-full
      md:px-4 md:py-2 md:rounded-2xl" />
                  }
                >
                  <PlusIcon className="h-5 w-5 md:hidden" />
                  <span className="hidden md:inline">+ New Project</span>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">Create Project</h4>
                      <p className="text-sm text-gray-500">Add a new project to your workspace.</p>
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
                      {inputLoading
                        ? <LoaderCircleIcon className="w-5 h-5 animate-spin" />
                        : "+ Create Project"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {currentUser ? (
                <Popover>
                  <PopoverTrigger
                    nativeButton={false}
                    render={
                      <img
                        src={currentUser.avatar_url}
                        className="w-10 h-10 rounded-full cursor-pointer"
                        alt="profile"
                      />
                    }
                  />
                  <PopoverContent className="w-80">
                    <AvatarUpload userId={currentUser.id} currentUrl={currentUser.avatar_url} />
                  </PopoverContent>
                </Popover>
              ) : (
                <LoaderCircleIcon className="w-10 h-10 animate-spin" />
              )}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}