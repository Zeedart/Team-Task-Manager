"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useRouter, usePathname } from "next/navigation"
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
import { JSX, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { set } from "date-fns"

export function NavMain({
  items,
  onDeleteProject,
}: {
  items: {
    title: string
    url: string
    icon?: JSX.Element
    isActive?: boolean
    items?: {
      id: number | string
      user_id: string
      title: string
      url: string
      createdOn: string
    }[]
  }[],
  onDeleteProject: (projectId: number | string) => Promise<void>;
}) {

  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLeaving, setIsLeaving] = useState(false);
  const router = useRouter()

  const pathname = usePathname()

  async function handleDelete(projectId: number | string) {
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
                    <SidebarMenuSubButton
                      className="group/hoverEffect animate-fade-in-up transition-opacity duration-300"
                      onClick={() => router.push(subItem.url)}
                      isActive={pathname === subItem.url}
                    >
                      <span className="truncate flex-1" title={subItem.title}>
                        {subItem.title}
                      </span>

                      {/* Delete button – invisible until hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // prevent triggering the parent navigation
                          setDeleteTarget(subItem.id)
                        }}
                        className="opacity-100 text-red-500 xl:opacity-0 mt-3 h-full  group-hover/hoverEffect:opacity-100 hover:text-red-500 transition-opacity"
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
                        setIsDeleting(true);
                        if (deleteTarget === null) return;
                        await handleDelete(deleteTarget);
                        setDeleteTarget(null);
                        setIsDeleting(false);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
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