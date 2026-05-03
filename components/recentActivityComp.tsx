import { Activity_log, Users } from "@/app/dashboard/data/types"

export default function RecentActivityComp({
    recentActivity,
    users,
}: {
    recentActivity: Activity_log[]
    users: Users[]
}) {

    function formatTime(date: string) {
        return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            year: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }
    return (
        <div className="p-6  w-[50%]">
            <h2 className="text-2xl font-bold text-[#172b4d] mb-4">
                Recent Activity
            </h2>

            <ul className="space-y-4">
                {recentActivity.slice(-6).reverse().map((activity) => {
                    const user = users.find(u => u.id === activity.user_id )

                    return (
                        <li key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src={user?.avatar_url}
                                    alt="User"
                                />
                            </div>


                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#172b4d]">
                                    {user?.username}
                                </p>

                                <p className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: activity.description }} />

                                <p className="text-xs text-gray-400">
                                    {formatTime(activity.createdOn)}
                                </p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}