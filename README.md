# Taskora 🚀

> A collaborative team task manager built with Next.js and Supabase.

Taskora helps teams organize their work into projects and tasks — with a clean kanban board, real-time activity logs, and workspace-based collaboration.

---

## 📸 Screenshots

> **Landing Page**
![landing page](./Readmeimages/Screenshot%202026-05-04%20184646.png)

> **Dashboard**
![Dashboard](./Readmeimages/Screenshot%202026-05-04%20184209.png)

> **Project page**
![Project](./Readmeimages/Screenshot%202026-05-04%20184218.png)

> **Specific project page**
![Specific Project](./Readmeimages/Screenshot%202026-05-04%20184406.png)

> **Task page**
![Task](./Readmeimages/Screenshot%202026-05-04%20184418.png)
---

## ✨ Features

- **Workspace system** — Each user gets their own workspace, auto-created on first login
- **Project management** — Create, view, and delete projects from the sidebar
- **Kanban board** — Tasks organized by status: To Do, In Progress, In Review, Completed
- **Task assignment** — Assign tasks to any workspace member with avatar display
- **Real-time activity log** — See a feed of recent actions across the workspace
- **User profiles** — Avatar upload and profile management via popover
- **Auth** — Supabase-powered authentication with protected routes
- **Responsive design** — Fully Responsive design

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Database & Auth | [Supabase](https://supabase.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Date Utilities | [date-fns](https://date-fns.org/) |

---

## 🔐 Authentication Flow

1. User signs in via Supabase Auth
2. On first login, a workspace is automatically created with sample projects and tasks
3. All data is scoped to the user's workspace

---

## 👤 Author

Built by **Yazeed Alkalmi** as a portfolio project.

- GitHub: [Yazeed Alkalmi](https://github.com/Zeedart)

---

## 📄 License

This project is open for viewing and inspiration. Please do not copy or redistribute without permission.

## Live Demo

# https://team-task-manager-steel-seven.vercel.app/