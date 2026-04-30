"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { Trash2Icon } from "@/components/ui/trash-2-icon"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export function NavMain({
  items,
  onDeleteProject,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      id: number
      user_id: number
      title: string
      url: string
      createdOn: string
    }[]
  }[],
  onDeleteProject: (projectId: number) => Promise<void>;
}) {

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const [isLeaving, setIsLeaving] = useState(false);

  async function handleDelete(projectId: number) {
    if (!onDeleteProject) return;
    setIsLeaving(true);

    try {
      await onDeleteProject(projectId);
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setIsLeaving(false);
    }
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible "
            render={<SidebarMenuItem />}
          >
            <div className="flex items-center w-full">

              {/* MAIN BUTTON */}
              <SidebarMenuButton tooltip={item.title}>
                {item.icon}

                <Link href={item.url} className="flex-1 text-left">
                  {item.title}
                </Link>
              </SidebarMenuButton>

              {/* SEPARATE TRIGGER */}
              <CollapsibleTrigger className="ml-auto">
                <ChevronRightIcon className="transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>

            </div>

            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton className="group/hoverEffect animate-fade-in-up transition-opacity duration-300 ">
                      <Link
                        href={subItem.url}
                        className="flex w-full items-center justify-between animate-fade-in-up"
                      >
                        <span className="truncate" title={subItem.title}>
                          {subItem.title}
                        </span>

                      </Link>
                      {/* Delete button – invisible until hover */}
                      <button
                        onClick={() => {
                          setDeleteTarget(subItem.id);
                        }}
                        className="opacity-0 group-hover/hoverEffect:opacity-100 mt-3 hover:text-red-500 transition-opacity"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>

              {/* Confirmation dialog */}
              <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The project and all its tasks will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        if (deleteTarget === null) return;
                        await handleDelete(deleteTarget);
                        setDeleteTarget(null);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}