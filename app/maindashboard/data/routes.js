import {DashboardIcon} from "@/components/ui/dashboard-icon"
import { RocketIcon } from "@/components/ui/rocket-icon"
export const routes = [
    {   
        
        id: 1,
        icon: DashboardIcon,
        name: 'Dashboard',
        path: '/maindashboard',
    },
    {
        id: 2,
        icon: RocketIcon,
        name: 'Projects',
        path: '/maindashboard/projects',
    }
]