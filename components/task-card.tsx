import type { Tasks } from "@/app/dashboard/data/types"
import type { Users } from "@/app/dashboard/data/types"
import { useState } from "react"
export default function TaskCard({ task, users, onDelete }: {
    task: Tasks
    users: Users[]
    onDelete?: (taskId: number) => Promise<void>
}) {

    const [isLeaving, setIsLeaving] = useState(false);

    const handleDelete = async () => {
        if (!onDelete) return;
        setIsLeaving(true);

        // Wait for the animation to complete (sync with CSS duration)
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            await onDelete(task.id);
            // No need to revert – the parent will remove this card from the list
        } catch (error) {
            // If deletion fails, bring the card back
            setIsLeaving(false);
        }
    };

    const user = users.find(
        user => task.assignedTo == user.id
    )

    const statusStyles = {
        "To do": {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-300",
        },
        "In Review": {
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
        <div
            className={`rounded-lg border bg-white p-4 shadow-sm
    transition-all duration-300
    animate-fade-in-up
    w-64
    ${isLeaving ? "opacity-0 scale-95 max-h-0 p-0 mb-0 border-0" : "opacity-100 scale-100 max-h-96"}
  `}
        >
            {/* Title */}
            <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-700 leading-snug">
                    {task.title}
                </p>
                <button onClick={handleDelete}
                    disabled={isLeaving}
                    className="mr-2 text-gray-500 hover:text-red-500 disabled:opacity-50">X</button>
            </div>

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
                    src={user?.avatar_url}
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