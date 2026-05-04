// app/dashboard/projects/[projectID]/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FolderSearchIcon } from "lucide-react"

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-6">
        <FolderSearchIcon className="h-16 w-16 text-gray-400" />
      </div>

      <h1 className="text-3xl font-bold text-[#172b4d] mb-3">
        Project not found
      </h1>

      <p className="text-gray-500 max-w-md mb-8">
        The project you're looking for doesn’t exist or you don’t have access to it.
        It may have been deleted or the link is incorrect.
      </p>

      <Button className="bg-blue-600 hover:bg-blue-700">
        <Link href="/dashboard">
          Back to Dashboard
        </Link>
      </Button>
    </div>
  )
}