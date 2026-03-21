export type Task = {
  id: number;
  title: string;
  status?: "In Review" | "In Progress" | "Completed";  // restrict to these values
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
  url?: string;       // optional, based on your previous code
  createdOn: string;  // could be Date if you parse it
};

export type Activity_log = {
  id: number;
  user_id: string;
  description: string;
  createdOn: string;
}