"use client"
import TaskCard from "@/components/task-card"
import { Button } from "@/components/ui/button"
import type { Tasks } from "@/app/dashboard/data/types"
import { useState, useEffect } from "react"
import client from "@/api/client"
import type { Users } from "@/app/dashboard/data/types"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ghost } from "lucide-react"
import {LoaderCircleIcon} from "@/components/ui/loader-circle-icon"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"

export default function ProjectBoard({ status, tasks, projectID,onTaskCreated, onDeleteTask, onUpdateTask }: 
    {
        status: string,
        tasks: Tasks[],
        projectID: string,
        onTaskCreated?: () => Promise<void>,
        onDeleteTask?: (taskId: number) => Promise<void>,
        onUpdateTask?: (taskId: number, newStatus: Tasks['status']) => Promise<void>
    }
) {

    const projectid = parseInt(projectID)


    const [users, setUsers] = useState<Users[]>([])
    const [inputLoading, setInputLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState("")
    const [selectedUserId, setSelectedUserId] = useState(null);
    const selectedUser = users.find((user) => user.id === selectedUserId);

    const [errors, setErrors] = useState({ title: "", assignee: "" });
    const isFormValid = title.trim() && selectedUserId;

    function validateForm() {
        const newErrors = {
            title: !title.trim() ? "Task title is required" : "",
            assignee: !selectedUserId ? "Assignee is required" : "",
        };
        setErrors(newErrors);
        return !newErrors.title && !newErrors.assignee;
    }

    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await client.from("users").select("*")

            if (error) {
                return console.log("FAILED TO FETCH USERS:", error)
            }
            else {
                setUsers(data)
            }

            setLoading(false)
        }

        fetchUsers()

    }, [])

    async function handleNewTask() {
    setInputLoading(true);
    if (!validateForm()) {
      setInputLoading(false);
      return;
    }

    const { data, error } = await client.from("tasks").insert([ { title, status: status, projectId: projectid, assignedTo: selectedUserId }, ]).select();

    if (error) {
      console.error("Error Adding Task:", error);
      toast.error("Failed to add task");
    } else {
      setTitle("");
      setSelectedUserId(null);
      toast.success("Task Added successfully!");

      // 🔥 Refresh tasks so the new card appears
      if (onTaskCreated) {
        await onTaskCreated();
      }
    }
    setInputLoading(false);
  }


    return (
        <div className="rounded-lg border w-80 bg-gray-100 bg-card text-card-foreground flex flex-col h-full">

            {/* Header */}
            <header className="w-full flex justify-between items-center px-3 py-2">
                <div className="flex gap-3 items-center">
                    <h1 className="text-gray-800 capitalize">
                        {status === "completed" ? "Status Check" : status}
                    </h1>
                    <span className="text-gray-600 text-sm">{tasks.length}</span>
                </div>

                <Popover>
                    <PopoverTrigger >
                        <Button variant="ghost" className="hover:text-blue-500">
                            +
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div>
                                <h4 className="font-semibold text-lg">
                                    Add Task
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Add a new Task to this project.
                                </p>
                            </div>
                            <form>
                                <div className="grid gap-2">
                                    <Label>Task title</Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Task"
                                        required
                                    />
                                </div>
                                <Field className="grid gap-2 mt-2">
                                    <FieldLabel htmlFor="form-assignTo">Assign to</FieldLabel>
                                    <Select required value={selectedUserId} onValueChange={setSelectedUserId}>
                                        <SelectTrigger id="form-assignTo" className="flex items-center gap-2">
                                            {selectedUser ? (
                                                // Custom display when a user is selected
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={selectedUser.avatar_url}
                                                        alt={selectedUser.username}
                                                        className="h-5 w-5 rounded-full"
                                                    />
                                                    <span className="text-left">{selectedUser.username}</span>
                                                </div>
                                            ) : (
                                                // Placeholder when nothing is selected
                                                <span className="text-muted-foreground">Select a user</span>
                                          
                                          )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={user.avatar_url}
                                                            alt={user.username}
                                                            className="h-5 w-5 rounded-full"
                                                        />
                                                        <span>{user.username}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                

                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 mt-5"
                                    disabled={inputLoading || !isFormValid}
                                    onClick={handleNewTask}
                                >
                                    {inputLoading ? <LoaderCircleIcon className="w-5 h-5 animate-spin" /> : "+ Add Task"}
                                </Button>
                            </form>

                        </div>
                    </PopoverContent>
                </Popover>
            </header>

            

            {/* Scroll Area */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden px-4 pb-3 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                <ol className="flex flex-col pr-4 gap-3">
                    {
                        tasks.map(task => (
                            <li key={task.id}><TaskCard task={task} users={users} onDelete={onDeleteTask} onUpdate={onUpdateTask} /></li>
                        ))
                    }
                </ol>
            </div>

        </div>
    )
}