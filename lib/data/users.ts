import type { User } from "@/lib/types/user"

export const currentUser: User = {
  id: "user-buildflow-owner",
  name: "BuildFlow Owner",
  email: "owner@buildflow.example",
}

export const users: User[] = [
  currentUser,
  {
    id: "user-project-admin",
    name: "Project Admin",
    email: "admin@buildflow.example",
  },
  {
    id: "user-project-member",
    name: "Project Member",
    email: "member@buildflow.example",
  },
]