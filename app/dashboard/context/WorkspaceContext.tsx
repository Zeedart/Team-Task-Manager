"use client";
import { createContext, useContext, useState, useEffect } from "react";
import client from "@/api/client";
import useAuth from "@/hooks/useAuth";
import { LoaderCircleIcon } from "@/components/ui/loader-circle-icon";
import type { User } from "@supabase/supabase-js";

const WorkspaceContext = createContext<number | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    const currentUser = user;

    async function initWorkspace() {
      // Check if user already has a workspace membership
      const { data: members } = await client
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", currentUser.id)
        .limit(1);

      if (members && members.length > 0) {
        setWorkspaceId(members[0].workspace_id);
        return;
      }

      // No workspace — create one with sample data
      // 1. Create workspace
      const { data: ws, error: wsErr } = await client
        .from("workspaces")
        .insert([{ name: "My Workspace", created_by: currentUser.id }])
        .select("id")
        .single();
      if (wsErr) { console.error(wsErr); return; }
      const wsId = ws.id;

      // 2. Add current user as owner
      await client.from("workspace_members").insert([
        { workspace_id: wsId, user_id: currentUser.id, role: "owner" }
      ]);

      // 3. Add bots as members
      const botIds = [
        "00000000-0000-0000-0000-000000000001",
        "00000000-0000-0000-0000-000000000002",
        "00000000-0000-0000-0000-000000000003",
      ];
      const botInserts = botIds.map(id => ({
        workspace_id: wsId,
        user_id: id,
        role: "member"
      }));
      await client.from("workspace_members").insert(botInserts);

      // 4. Create sample projects
      const { data: proj1 } = await client.from("projects").insert([
        { user_id: currentUser.id, title: "Website Redesign", workspace_id: wsId }
      ]).select("id").single();

      if (!proj1) { console.error("Failed to create proj1"); return; }
      const { data: proj2 } = await client.from("projects").insert([
        { user_id: currentUser.id, title: "Mobile App", workspace_id: wsId }
      ]).select("id").single();
      
      if (!proj2) { console.error("Failed to create proj2"); return; }

      // 5. Create sample tasks (adjust column names to your table!)
      const tasksToInsert = [
        { title: "Draft homepage mockup", status: "Completed", projectId: proj1.id, assignedTo: botIds[0] },
        { title: "Implement dark mode", status: "In Progress", projectId: proj1.id, assignedTo: botIds[1] },
        { title: "Fix login bug", status: "In Review", projectId: proj2.id, assignedTo: botIds[2] },
        { title: "Write unit tests", status: "To do", projectId: proj2.id, assignedTo: currentUser.id }
      ];
      await client.from("tasks").insert(tasksToInsert);

      // 6. Create sample activity logs
      await client.from("activity_logs").insert([
        { user_id: currentUser.id, description: "You joined the workspace", workspace_id: wsId },
        { user_id: botIds[0], description: "Alice completed 'Draft homepage mockup'", workspace_id: wsId }
      ]);

      setWorkspaceId(wsId);
    }

    initWorkspace();
  }, [user, loading]);

  if (loading || !workspaceId) {
    return <div className="p-6 flex items-center justify-center min-h-screen">
  <LoaderCircleIcon size={50} className="animate-spin text-blue-500" />
</div>
  }

  return (
    <WorkspaceContext.Provider value={workspaceId}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => useContext(WorkspaceContext);