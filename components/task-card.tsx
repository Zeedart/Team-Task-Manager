import type { Tasks } from "@/app/dashboard/data/types"
import type { Users } from "@/app/dashboard/data/types"
import { useState } from "react"
import { Trash2Icon } from "@/components/ui/trash-2-icon"
import { EllipsisIcon } from "@/components/ui/ellipsis-icon"
import { TrendingUpDownIcon } from "@/components/ui/trending-up-down-icon"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function TaskCard({ task, users, onDelete, onUpdate }: {
    task: Tasks
    users: Users[]
    onDelete?: (taskId: number) => Promise<void>
    onUpdate?: (taskId: number, newStatus: Tasks["status"]) => Promise<void>
}) {

    const [isLeaving, setIsLeaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(task.status);

    const handleStatusChange = async () => {
        if (!onUpdate) return;
        setIsUpdating(true);


        try {
            await onUpdate(task.id, currentStatus);
        } catch (error) {
            console.error("Error updating task status:", error);
        } finally {
            setIsUpdating(false);
        }
    };


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
    w-full
    ${isLeaving ? "opacity-0 scale-95 max-h-0 p-0 mb-0 border-0" : "opacity-100 scale-100 max-h-96"}
  `}
        >
            {/* Title */}
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700 leading-snug truncate" title={task.title}>
                    {task.title}
                </p>
                <Popover>
                    <PopoverTrigger className="m-0 p-0">
                        <Button variant="ghost" className="hover:text-blue-500">
                            <EllipsisIcon />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="rounded-md p-2 w-64" align="start">
                        <ul>
                            <li className="px-1 py-2 cursor-pointer">
                                <button onClick={handleDelete}
                                    disabled={isLeaving}
                                    className="mr-2 hover:text-red-500 disabled:opacity-50 flex items-center">
                                    <Trash2Icon className="w-6 h-6" /><span className="ml-3 mt-1">Delete</span>
                                </button>
                            </li>
                            <li>
                                <Accordion
                                    collapsible="true"
                                    className="max-w-lg border border-0"
                                >
                                    <AccordionItem value="changeStatus">
                                        <AccordionTrigger className="w-full px-1 py-2 hover:text-blue-500 flex items-center ">
                                            <TrendingUpDownIcon className="w-6 h-6 " /><span className="ml-1 mt-1">Change Status</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <form>
                                                <Field>
                                                    <Select value={currentStatus} onValueChange={(newStatus) => {
                                                        const typed = newStatus as Tasks["status"];
                                                        setCurrentStatus(typed);
                                                        onUpdate?.(task.id, typed);          // immediate sync
                                                    }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Status</SelectLabel>
                                                                <SelectItem value="In Review">In Review</SelectItem>
                                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                                <SelectItem value="Completed">Completed</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            </form>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </li>
                        </ul>
                    </PopoverContent>
                </Popover>

            </div>

            {/* Status tag */}
            <div className="mt-1">
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