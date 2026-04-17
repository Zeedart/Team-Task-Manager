'use client'

import Link from "next/link"
import React, { useState, useEffect, useMemo } from "react"
import {toast} from "sonner"
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

export default function MainLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [projects, setProjects] = useState([])
  const [ users, setUsers ] = useState([])
  const [title, setTitle] = useState("")
  const [inputLoading, setInputLoading] = useState(false)

  // ----------------------------
  // AUTH REDIRECT
  // ----------------------------
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/")
    }
  }, [loading, user, router])

  // ----------------------------
  // FETCH PROJECTS (FIXED)
  // ----------------------------
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await client
        .from("projects")
        .select("*")

      if (error) {
        console.log("Failed to fetch projects:", error)
      } else {
        setProjects(data || [])
      }
    }

    fetchProjects() // 🔥 FIX: actually call it
  }, [])


    // ----------------------------
  // FETCH USERS
  // ----------------------------
  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await client
        .from("users")
        .select("*")

      if (error) {
        console.log("Failed to fetch users:", error)
      } else {
        setUsers(data || [])
      }
    }

    fetchUsers()
  }, [])


  const currentUser = useMemo(() => {
    return users.find(u => u.id === user.id)
  }, [users, user])


  // ----------------------------
  // FAST LOOKUP MAP (FIXED)
  // ----------------------------
  const projectMap = useMemo(() => {
    return Object.fromEntries(
      projects.map(p => [String(p.id), p.title])
    )
  }, [projects])

  // ----------------------------
  // BREADCRUMBS (FIXED)
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

    const { data, error } = await client
      .from("projects")
      .insert([
        {
          title,
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating project:", error)
    } else {
      // 🔥 BEST FIX (no reload)
      setProjects(prev => [...prev, data[0]])
      setTitle("")
      toast.success("Project created successfully!")
    }

    setInputLoading(false)
  }

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
                        <Link asChild href={crumb.href}>{crumb.label}</Link>
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
                  <h4 className="font-semibold text-lg">
                    Create Project
                  </h4>
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
                  disabled={inputLoading}
                >
                  {inputLoading ? "Creating..." : "+ Create Project"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <SettingsIcon size={30} />
          <img
            src={currentUser?.avatar_url}
            className="w-10 h-10 rounded-full"
            alt="profile"
          />
        </div>
      </header>

      {/* BODY */}
      <div className="flex h-full w-full">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>

        <main>{children}</main>
      </div>
    </div>
  )
}