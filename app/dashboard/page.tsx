import { DataCard } from "@/components/data-card";
import { projectRoutes } from "./data/projects";
import  RecentActivityComp  from "@/components/recentActivityComp";
import  {recentActivity}  from "./data/recentActivity";
import { tasks } from "./data/tasks";
import MyTasks from "@/components/myTasks";

export default function MainDashboard() {
    const totalProjects = projectRoutes.length;
    console.log("Recent Activity:", recentActivity);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-[#172b4d]">Dashboard</h1>
            <h2 className="text-lg mt-2 ml-6 font-semibold text-gray-700">Overview</h2>
            <div className="mt-6 ml-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DataCard title="Total Projects" value={totalProjects} />
                <DataCard title="Total Tasks" value={45} />
                <DataCard title="Tasks Assigned to me" value={3} />
                <DataCard title="Tasks Completed" value={12} />
            </div>
            <div className="mt-10 w-full flex">
                <RecentActivityComp recentActivity={recentActivity} />
                <MyTasks tasks={tasks}/>
            </div>
        </div>
    );
}