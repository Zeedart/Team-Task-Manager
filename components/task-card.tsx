import type { Task } from "@/app/dashboard/data/types"
import type { Users } from "@/app/dashboard/data/types"
export default function TaskCard({ task, users }: {
    task: Task
    users: Users[]
}) {

    const user = users.find(
        user => task.assignedTo == user.id
    )

    const statusStyles = {
        "To do": {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-300",
        },
        "Pending": {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-300",
        },
        "In Progress": {
            bg: "bg-purple-100",
            text: "text-purple-800",
            border: "border-purple-300",
        },
        "Completed": {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-300",
        },
    };

    return (
        <div className="w-64 rounded-lg border bg-white p-4 shadow-sm">
            {/* Title */}
            <p className="text-sm font-medium text-gray-700 leading-snug">
                {task.title}
            </p>

            {/* Status tag */}
            <div className="mt-2">
                <span className={`rounded px-3 py-2 text-[12px] font-semibold 
                    ${statusStyles[task.status].bg
                    } ${statusStyles[task.status].text} ${statusStyles[task.status].border}`}>
                    {task.status}
                </span>
            </div>

            {/* User row */}
            <div className="mt-4 flex gap-4">
                {/* Avatar */}
                <img
                    src={user?.img}
                    alt="user"
                    className="h-6 w-6 rounded-full"
                />
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">{user?.username}</span>
                </div>

            </div>
        </div>
    )
}