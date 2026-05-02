import client from "@/api/client"

export default async function handleNewActivity(message, currentUser, workspaceId) {

    const { error } = await client
    .from("activity_logs")
    .insert({
      user_id: currentUser.id,
      description: message,
      workspace_id: workspaceId
    })

    if (error) {
      console.log("Failed to log activity:", error)
    }
  }