// components/AvatarUpload.tsx
"use client"
import { useState } from "react"
import client from "@/api/client"
import { toast } from "sonner"

export default function AvatarUpload({ userId, currentUrl }: { userId: string; currentUrl?: string }) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(currentUrl)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type/size (optional)
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 2 * 1024 * 1024) { // 2 MB
      toast.error("File size must be less than 2MB")
      return
    }

    setUploading(true)

    // Generate a unique file path: Avatars/<user-id>/<timestamp>-<filename>
    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await client.storage
      .from("Avatars")
      .upload(filePath, file, { upsert: false })

    if (uploadError) {
      console.error(uploadError)
      toast.error("Upload failed")
      setUploading(false)
      return
    }

    // Get the public URL
    const { data: publicUrlData } = client.storage.from("Avatars").getPublicUrl(filePath)
    const publicUrl = publicUrlData.publicUrl

    // Update the user's avatar_url in the database
    const { error: updateError } = await client
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId)

    if (updateError) {
      console.error(updateError)
      toast.error("Failed to update profile")
    } else {
      setAvatarUrl(publicUrl)
      toast.success("Profile picture updated!")
    }

    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={avatarUrl || "/default-avatar.png"}
        alt="Avatar"
        className="h-20 w-20 rounded-full object-cover border"
      />
      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {uploading ? "Uploading..." : "Change Avatar"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  )
}