"use client"

import Link from "next/link"
import { SettingsIcon } from "@/components/ui/settings-icon"
import { Button } from "@/components/ui/button"
import { routes } from "./data/routes.js"
import { projectRoutes } from "./data/projects.js"
import { usePathname } from "next/navigation"
import LOGO from "@/images/LOGO.svg"

//{routes.map(route => (
//<li key={route.id} className="text-lg font-medium text-[#172b4d] hover:text-[#1868db] cursor-pointer">
//  <Link key={route.id} href={route.path}>
//    {route.name}
// </Link>
//</li>
//))}


export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    return (
        <div>
            <header className="h-15 border-b border-gray-300 flex justify-between items-center">
                <div className="flex">
                    <img src={LOGO.src} alt="Logo" className="w-10 h-10 mt-4 ml-5" />
                    <h1 className="text-2xl font-bold text-[#172b4d] p-5">Team Task Manager</h1>
                </div>
                <div className="h-15 border-b border-gray-300 flex p-5 gap-4 items-center">
                    <Button>+ Create Project</Button>
                    <SettingsIcon size={30} className="hover:text-[#1868db] transition-colors duration-500" />
                    <img src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" alt="Profile Picture" className="w-10 h-10 rounded-full" />
                </div>
            </header>
            <div className="flex fixed ">
                <aside className="w-75 h-screen border-r border-gray-300">
                    <nav className="w-full pt-5 pl-5 pr-5">
                        <ul>
                            {routes.map(route => {
                                const isActive = pathname === route.path
                                return (
                                    <Link
                                        key={route.id}
                                        href={route.path}
                                    >     
                                        <li key={route.id} className={`${isActive ? "text-blue-500 bg-[#e9f2fe]" : "text-[#172b4d]"} text-lg p-2 rounded-sm font-medium hover:text-[#1868db] cursor-pointer`}>
                                            <route.icon size={20} className="mr-2"/>{route.name}
                                        </li>
                                    </Link>
                                )
                            })}
                        </ul>
                    </nav>
                    <nav className="ml-5 pt-2 pl-5 pr-5">
                        <h1 className="text-md font-semibold text-gray-700 mb-2">Starred</h1>
                        <ul className="ml-5">
                            {projectRoutes.slice(0, 3).map(route => {
                                const isActive = pathname === route.path
                                return (
                                    <Link
                                        key={route.id}
                                        href={route.path}
                                    >
                                        <li key={route.id} className={`${isActive ? "text-blue-500 bg-[#e9f2fe]" : "text-[#172b4d]"} text-lg p-2 rounded-sm font-medium hover:text-[#1868db] cursor-pointer`}>
                                            {route.name}
                                        </li>
                                    </Link>
                                )
                            })}
                        </ul>
                    </nav>
                </aside>
                <main>{children}</main>
            </div>
        </div>
    )
}
