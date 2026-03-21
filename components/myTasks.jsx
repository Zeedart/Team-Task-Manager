import useAuth from "@/hooks/useAuth"

export default function MyTasks({ tasks }) {
  const { user, loading } = useAuth()

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
  }

  if (loading || !user) return <p>Loading...</p>
  console.log(user, tasks)

  return (
    <div className="p-6 w-[50%]">
      <h2 className="text-2xl font-bold text-[#172b4d] mb-4">
        My Tasks
      </h2>

      <ul className="space-y-4">
        {tasks
          .filter(task => task.assignedTo === user.id)
          .map(task => (
            <li key={task.id} className="flex items-start space-x-3">
              <p className="text-xl font-medium text-[#172b4d]">
                {task.title}
              </p>

              <div className="mt-2">
                <span
                  className={`rounded px-3 py-2 text-[12px] font-semibold
                  ${statusStyles[task.status]?.bg}
                  ${statusStyles[task.status]?.text}
                  ${statusStyles[task.status]?.border}`}
                >
                  {task.status}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}