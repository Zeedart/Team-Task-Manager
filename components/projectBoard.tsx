import TaskCard from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { users } from "@/app/dashboard/data/users"
import type { Task } from "@/app/dashboard/data/types"

export default function ProjectBoard({ status, tasks }:
    {
        status: string
        tasks: Task[]
    }
) {

    return (
        <div className="rounded-lg border bg-gray-100 bg-card text-card-foreground flex flex-col h-full">

            {/* Header */}
            <header className="w-full flex justify-between items-center px-3 py-2">
                <div className="flex gap-3 items-center">
                    <h1 className="text-gray-800 capitalize">
                        {status === "completed" ? "Status Check" : status}
                    </h1>
                    <span className="text-gray-600 text-sm">{tasks.length}</span>
                </div>

                <Button size="sm" variant="ghost" className="text-blue-700">
                    +
                </Button>
            </header>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                <ol className="flex flex-col gap-3">
                    {
                        tasks.map(task => (
                            <li><TaskCard task={task} users={users} /></li>
                        ))
                    }
                </ol>
            </div>

        </div>
    )
}