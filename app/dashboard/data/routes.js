import {DashboardIcon} from "@/components/ui/dashboard-icon"
import { RocketIcon } from "@/components/ui/rocket-icon"
export const routes = [
    {   
        
        id: 1,
        icon: DashboardIcon,
        name: 'Home',
        path: '/dashboard',
    },
    {
        id: 2,
        icon: RocketIcon,
        name: 'Projects',
        path: '/dashboard/projects',
    }
]