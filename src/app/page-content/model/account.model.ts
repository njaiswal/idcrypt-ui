export interface Account {
  accountId?: string;
  name: string;
  address?: string;
  email: string;
  status: Status;
  tier: Tier;
  createdAt?: string;
  owner?: string;
  domain?: string;
}

export interface NewAccount {
  name: string;
}

export enum Status {
  active = 'active',
  inactive = 'inactive'
}

export enum Tier {
  free = 'free',
  paid = 'paid'
}
