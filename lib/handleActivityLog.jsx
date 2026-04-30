import client from "@/api/client"

export default async function handleNewActivity(message, currentUser) {

    const { error } = await client
    .from("activity_logs")
    .insert({
      user_id: currentUser.id,
      description: message,
    })

    if (error) {
      console.log("Failed to log activity:", error)
    }
  }