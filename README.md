# Taskora 🚀

> A collaborative team task manager built with Next.js and Supabase.

Taskora helps teams organize their work into projects and tasks — with a clean kanban board, real-time activity logs, and workspace-based collaboration.

---

## 📸 Screenshots

> **Landing Page**
![landing page](./screenshots/sidebar.png)

> **Dashboard**
![Dashboard](./screenshots/dashboard.png)

> **Project page**
![Project](./screenshots/project-board.png)

> **Specific project page**
![Specific Project](./screenshots/project-board.png)
---

## ✨ Features

- **Workspace system** — Each user gets their own workspace, auto-created on first login
- **Project management** — Create, view, and delete projects from the sidebar
- **Kanban board** — Tasks organized by status: To Do, In Progress, In Review, Completed
- **Task assignment** — Assign tasks to any workspace member with avatar display
- **Real-time activity log** — See a feed of recent actions across the workspace
- **User profiles** — Avatar upload and profile management via popover
- **Auth** — Supabase-powered authentication with protected routes
- **Responsive design** — Collapsible sidebar, mobile-friendly header with icon-only buttons on small screens

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Database & Auth | [Supabase](https://supabase.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Date Utilities | [date-fns](https://date-fns.org/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/taskora.git
cd taskora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

In your Supabase project, create the following tables:

- `users` — id, username, email, avatar_url
- `workspaces` — id, name, created_by
- `workspace_members` — workspace_id, user_id, role
- `projects` — id, title, user_id, workspace_id
- `tasks` — id, title, status, projectId, assignedTo
- `activity_logs` — id, user_id, workspace_id, description, created_at

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── app/
│   ├── dashboard/
│   │   ├── context/         # WorkspaceContext
│   │   ├── data/            # TypeScript types
│   │   ├── projects/        # Project pages & board
│   │   ├── tasks/           # Tasks page
│   │   └── layout.tsx       # Main layout with sidebar & header
│   └── page.tsx             # Login / landing page
├── components/
│   ├── ui/                  # shadcn/ui + custom components
│   ├── app-sidebar.tsx      # Sidebar with project list
│   ├── nav-main.tsx         # Collapsible project nav
│   ├── task-card.tsx        # Kanban task card
│   └── projectBoard.tsx     # Kanban column
├── hooks/
│   └── useAuth.js           # Auth hook
└── api/
    └── client.js            # Supabase client
```

---

## 🔐 Authentication Flow

1. User signs in via Supabase Auth
2. On first login, a workspace is automatically created with sample projects and tasks
3. All data is scoped to the user's workspace

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

Recommended deployment: **[Vercel](https://vercel.com/)** — import your GitHub repo, add your environment variables, and deploy in one click.

---

## 👤 Author

Built by **Yazeed Alkalmi** as a portfolio project.

- GitHub: [Yazeed Alkalmi](https://github.com/Zeedart)

---

## 📄 License

This project is open for viewing and inspiration. Please do not copy or redistribute without permission.