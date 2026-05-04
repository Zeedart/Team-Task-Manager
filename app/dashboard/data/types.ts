export type Tasks = {
  id: number;
  title: string;
  status?: "In Review" | "In Progress" | "Completed"; 
  projectId?: number;
  assignedTo: string; 
};

export type Users = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
};

export type Project = {
  id: number;
  user_id: string;
  title: string;
  url?: string;      
  createdOn: string; 
};

export type Activity_log = {
  id: number;
  user_id: string;
  description: string;
  createdOn: string;
}