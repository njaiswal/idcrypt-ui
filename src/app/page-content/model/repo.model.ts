export interface Repo {
  repoId: string;
  accountId: string;
  name: string;
  desc: string;
  retention: number;
  approvers: string[];
  users: string[];
  createdAt: string;
}

export interface ManageUsersList {
  category: UserListType;
  list: string[];
}


export enum UserListType {
  approvers = 'approvers',
  users = 'users',
  members = 'members'
}
