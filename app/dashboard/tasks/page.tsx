"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import client from "@/api/client";
import { useWorkspace } from "@/app/dashboard/context/WorkspaceContext";

interface Task {
  id: number;
  title: string;
  status: string;
  projectId: number;
  assignedTo: string;
}
interface Project {
  id: number;
  title: string;
}
interface User {
  id: string;
  username: string;
}

export default function Tasks() {
  const workspaceId = useWorkspace(); 
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return; // wait for workspace

    async function fetchData() {
      // 1. Fetch projects in this workspace
      const projectsRes = await client
        .from("projects")
        .select("id, title")
        .eq("workspace_id", workspaceId);

      if (projectsRes.error) {
        console.error("Error fetching projects:", projectsRes.error);
        setLoading(false);
        return;
      }

      const projectIds = projectsRes.data.map((p) => p.id);

      // 2. Fetch only tasks belonging to those projects
      const tasksRes = await client
        .from("tasks")
        .select("*")
        .in("projectId", projectIds);

      if (tasksRes.error) {
        console.error("Error fetching tasks:", tasksRes.error);
      }

      // 3. Fetch workspace members (for "Assigned to" column)
      const membersRes = await client
        .from("workspace_members")
        .select("user_id, users(username, id)")
        .eq("workspace_id", workspaceId);

      // Extract user objects from the join
      const memberUsers =
        membersRes.data?.map((m: any) => m.users) ?? [];

      setProjects(projectsRes.data);
      setTasks(tasksRes.data ?? []);
      setUsers(memberUsers);
      setLoading(false);
    }

    fetchData();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="p-6 w-full">
        <Skeleton className="h-8 w-32 mb-2 bg-gray-200" />
        <Skeleton className="h-5 w-40 ml-6 mb-6 bg-gray-200" />

        <div className="w-full mt-6 ml-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assigned to</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-50 bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28 bg-gray-200" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-gray-200" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    "To do": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    "In Review": { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
    "In Progress": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
    "Completed": { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-[#172b4d]">Tasks</h1>
      <h2 className="text-lg mt-2 md:ml-6 lg:ml-6 font-semibold text-gray-700">List of Tasks</h2>
      <div className="w-full mt-6 md:ml-6 lg:ml-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Assigned to</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const user = users.find((u) => u.id === task.assignedTo);
              const style = statusStyles[task.status] ?? { bg: "", text: "", border: "" };

              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <span className={`rounded px-3 py-2 text-[12px] font-semibold ${style.bg} ${style.text} ${style.border}`}>
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>{project?.title ?? "—"}</TableCell>
                  <TableCell>{user?.username ?? "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}