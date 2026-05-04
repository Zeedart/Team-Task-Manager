"use client"
import { DataCard } from "@/components/data-card";
import RecentActivityComp from "@/components/recentActivityComp";
import MyTasks from "@/components/myTasks";
import client from "@/api/client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import useAuth from "@/hooks/useAuth.js"
import { Skeleton } from "@/components/ui/skeleton"
import { useWorkspace } from "@/app/dashboard/context/WorkspaceContext";

export default function MainDashboard() {
    const [projects, setProjects] = useState([])
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [activities, setActivities] = useState([])
    const [loading1, setLoading1] = useState(true)

    const { user, loading } = useAuth();
    const workspaceId = useWorkspace()
    const router = useRouter();


    // Auth redirect
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [loading, user, router]);


    useEffect(() => {
        async function fetchData() {
            // 1. Fetch projects
            const projectsRes = await client
                .from("projects")
                .select("id, title")                     
                .eq("workspace_id", workspaceId);

            if (projectsRes.error) {
                console.error("Error fetching projects:", projectsRes.error);
                setLoading1(false);
                return;
            }

            const projectIds = projectsRes.data.map(p => p.id);

            // 2. Fetch tasks only for those projects
            const tasksRes = await client
                .from("tasks")
                .select("*")
                .in("projectId", projectIds);

            // 3. Fetch users
            const usersRes = await client.from("users").select("*");

            // 4. Fetch activities 
            const activityRes = await client
                .from("activity_logs")
                .select("*")
                .eq("workspace_id", workspaceId);

            // Handle all errors
            if (tasksRes.error || usersRes.error || activityRes.error) {
                console.error("Error fetching:", tasksRes.error || usersRes.error || activityRes.error);
            } else {
                setProjects(projectsRes.data);
                setTasks(tasksRes.data);
                setUsers(usersRes.data);
                setActivities(activityRes.data);
            }

            setLoading1(false);
        }

        if (workspaceId) fetchData();  
    }, [workspaceId]);              



    if (loading1 | loading | !user) {
        return (
            <div className="p-6">
                <Skeleton className="h-8 w-50 mb-2 bg-gray-200" />
                <Skeleton className="h-5 w-32 ml-6 mt-5 mb-6 bg-gray-200" />
                <div className="mt-6 ml-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-lg border w-80 p-10">
                            <Skeleton className="h-6 w-32 mx-auto bg-gray-200 mb-4" />
                            <Skeleton className="h-10 w-20 bg-gray-200 mx-auto" />
                        </div>
                    ))}
                </div>

                <div className="mt-10 w-full flex gap-6">

                    <div className="p-6 w-[50%]">
                        <Skeleton className="h-7 w-60 mb-6 bg-gray-200" />

                        <ul className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <li key={i} className="flex items-start space-x-3">
                                    <Skeleton className="h-10 bg-gray-200 w-10 rounded-full" />

                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 bg-gray-200 w-32" />
                                        <Skeleton className="h-3 bg-gray-200 w-48" />
                                        <Skeleton className="h-3 bg-gray-200 w-20" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 w-[50%]">
                        <Skeleton className="h-7 bg-gray-200 w-40 mb-6" />

                        <ul className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-5 bg-gray-200 w-60" />
                                    <Skeleton className="h-6 bg-gray-200 w-24 rounded-md" />
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        )
    }


    const totalProjects = projects.length;

    const currentuser = user.id

    const totalTaskCompleted = tasks.filter(
        task => task.assignedTo == currentuser && task.status == "Completed"
    ).length

    const curUserTasks = tasks.filter(
        task => task.assignedTo === currentuser && (task.status == "In Progress" || task.status == "In Review")
    ).length

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-[#172b4d]">Dashboard</h1>
            <h2 className="text-lg mt-2 md:ml-6 lg:ml-6 font-semibold text-gray-700">Overview</h2>
            <div className="mt-6 md:ml-6 lg:ml-6  grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                <DataCard title="Total Projects" value={totalProjects} />
                <DataCard title="Total Tasks" value={tasks.length} />
                <DataCard title="Tasks Assigned to me" value={curUserTasks} />
                <DataCard title="Tasks Completed" value={totalTaskCompleted} />
            </div>
            <div className="mt-10 w-full flex flex-col md:flex-row gap-6 lg:gap-6">
                <RecentActivityComp users={users} recentActivity={activities} />
                <MyTasks tasks={tasks} />
            </div>
        </div>
    );
}