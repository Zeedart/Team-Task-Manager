export default function RecentActivityComp( { recentActivity }: { recentActivity: { user: string; desc: string; date: string; img: string }[] }) {
    return (
        <div className="p-6 w-[50%]">
            <h2 className="text-2xl font-bold text-[#172b4d] mb-4">Recent Activity</h2>
            <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <img
                                className="h-10 w-10 rounded-full"
                                src={activity.img}
                                alt="User"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#172b4d]">
                                {activity.user}
                            </p>
                            <p className="text-sm text-gray-500">
                                {activity.desc}
                            </p>
                            <p className="text-xs text-gray-400">
                                {activity.date}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}