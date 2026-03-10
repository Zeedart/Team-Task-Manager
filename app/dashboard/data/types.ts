export type Task = {
  id: number;
  title: string;
  status?: "Pending" | "In Progress" | "Completed";  // restrict to these values
  projectId?: number;
  assignedTo: number;   // user id
};

export type Users = {
  id: number;
  username: string;
  img: string;
};

export type Project = {
  id: number;
  title: string;
  url?: string;       // optional, based on your previous code
  createdOn: string;  // could be Date if you parse it
};