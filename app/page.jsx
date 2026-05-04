'use client'

import { redirect } from 'next/navigation'
import Login from "../components/auth/login";
import useAuth from "@/hooks/useAuth"
import Auth from "@/components/auth/auth"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


export default function Page() {
    const { user, loading } = useAuth();
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard")
            return undefined;
        }
    }, [loading, user])

    return (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-8 min-h-screen bg-[#f4f5f7] p-4 ">
                <div className="p-5 w-full md:w-1/2">
                    <h1 className="text-3xl text-center md:text-left font-bold text-[#172b4d] mb-5">Welcome to Team Task Manager</h1>
                    <p className="text-lg text-center md:text-left text-[#172b4d] mb-5">Your all-in-one solution for managing team tasks and projects efficiently.</p>
                </div>
                {loading ?
                    <SkeletonTheme>
                        <Skeleton />
                    </SkeletonTheme>
                    :
                    <Auth />}
            </div>
    )

}