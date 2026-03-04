import Link from "next/link"
import { SettingsIcon } from "@/components/ui/settings-icon"
import { Button } from "@/components/ui/button"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <header className="h-15 border-b border-gray-300 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#172b4d] p-5">Team Task Manager</h1>
                </div>
                <div className="h-15 border-b border-gray-300 flex p-5 gap-4 items-center">
                    <Button>+ Create Project</Button>
                    <SettingsIcon size={30} className="hover:text-[#1868db] transition-colors duration-500" />
                    <img src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" alt="Profile Picture" className="w-10 h-10 rounded-full" />
                </div>
            </header>
            <div className="flex fixed">
                <aside>
                    <nav className="w-60 h-screen border-r border-gray-300 p-5">
                        <ul className="space-y-4">
                            <li className="text-lg font-medium text-[#172b4d] hover:text-[#1868db] cursor-pointer"><Link href="/maindashboard">Dashboard</Link></li>
                            <li className="text-lg font-medium text-[#172b4d] hover:text-[#1868db] cursor-pointer"><Link href="./maindashboard/projects">Projects</Link></li>
                            <li className="text-lg font-medium text-[#172b4d] hover:text-[#1868db] cursor-pointer">Teams</li>
                            <li className="text-lg font-medium text-[#172b4d] hover:text-[#1868db] cursor-pointer">Calendar</li>
                            <li className="text-lg font-medium text-[#172b4d] hover:text-[#1868db] cursor-pointer">Settings</li>
                        </ul>
                    </nav>

                </aside>
                <main>{children}</main>
            </div>
        </div>
    )
}
