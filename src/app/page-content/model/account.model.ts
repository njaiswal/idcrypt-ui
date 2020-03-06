export interface Account {
  accountId: string;
  name: string;
  address?: string;
  email: string;
  status: Status;
  tier: Tier;
  createdAt: string;
  owner: string;
  domain: string;
  members: string[];
  admins: string[];
}

export interface NewAccount {
  name: string;
  repo: NewRepo;
}

export interface NewRepo {
  name: string;
  desc: string;
  retention: number;
}

export enum Status {
  active = 'active',
  inactive = 'inactive'
}

export enum Tier {
  free = 'free',
  paid = 'paid'
}
