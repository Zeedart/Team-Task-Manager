export default function MyTasks({ tasks }: {
    tasks: {
        id: number,
        title: string,
        status: string,
        projectId: number,
        assignedTo: number
    }[]
}) {

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
        <div className="p-6 w-[50%]">
            <h2 className="text-2xl font-bold text-[#172b4d] mb-4">My Tasks</h2>
            <ul className="space-y-4">
                {tasks
                    .filter(task => task.assignedTo == 1)
                    .map((task) => (
                            <li className="flex items-start space-x-3 flex" key={task.id}>
                                <p className="text-xl font-medium text-[#172b4d]">{task.title}</p>
                                <div className="mt-2">
                                    <span className={`rounded px-3 py-2 text-[12px] font-semibold 
                                            ${statusStyles[task.status].bg
                                        } ${statusStyles[task.status].text} ${statusStyles[task.status].border}`}>
                                        {task.status}
                                    </span>
                                </div>
                            </li>
                    ))
                }

            </ul>
        </div>
    )
}