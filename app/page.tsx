import { redirect } from 'next/navigation'
import Login from "../components/login";

export default function Page() {
    const loggedIn = true; // Simulate authentication status
    if (loggedIn) {
        return redirect("/maindashboard");
    }

    return (
        <div className="flex items-center justify-center space-x-55 min-h-screen bg-[#f4f5f7]">
            <div className="p-5">
                <h1 className="text-3xl font-bold text-[#172b4d] mb-5">Welcome to Team Task Manager</h1>
                <p className="text-lg text-[#172b4d] mb-5">Your all-in-one solution for managing team tasks and projects efficiently.</p>
            </div>
            <Login />
        </div>
    )

}