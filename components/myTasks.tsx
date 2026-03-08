export default function MyTasks({ tasks }: {
    tasks: {
        id: number,
        title: string,
        status: string,
        projectId: number,
        assignedTo: number
    }[]
}) {
    return (
        <div className="p-6 w-[50%]">
            <h2 className="text-2xl font-bold text-[#172b4d] mb-4">My Tasks</h2>
            <ul className="space-y-4">
                {tasks
                    .filter(task => task.assignedTo == 1)
                    .map((task) => (
                        <>
                            <li className="flex items-start space-x-3 flex" key={task.id}>
                                <p className="text-xl font-medium text-[#172b4d]">{task.title}</p>
                                <p className="text-sm font-medium text-[#172b4d] mt-2">IN PROGRESS</p>
                            </li>
                            <hr />
                        </>
                    ))
                }

            </ul>
        </div>
    )
}