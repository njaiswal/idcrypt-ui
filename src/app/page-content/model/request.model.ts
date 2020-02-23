export interface NewAppRequest {
  accountId: string;
  requestType: RequestType;
  requestedOnResource: string;
}

export interface AppRequest {
  'requestId': string;
  'accountId': string;
  'accountName': string;
  'requestee': string;
  'requesteeEmail': string;
  'requestor': string;
  'requestorEmail': string;
  'requestType': RequestType;
  'requestedOnResource': string;
  'requestedOnResourceName': string;
  'status': RequestStatus;
  'createdAt': string;
  'updateHistory': UpdateHistory[];
}

export enum RequestStatus {
  pending = 'pending',
  approved= 'approved',
  denied = 'denied',
  failed = 'failed',
  cancelled = 'cancelled',
  closed = 'closed'
}

export enum RequestType {
  joinAccount= 'joinAccount',
  leaveAccount = 'leaveAccount',
  joinAsAccountAdmin = 'joinAsAccountAdmin',
  leaveAsAccountAdmin = 'leaveAsAccountAdmin',
  joinAsApprover = 'joinAsApprover',
  leaveAsApprover = 'leaveAsApprover',
  joinAsRepoUser = 'joinAsRepoUser',
  leaveAsRepoUser = 'leaveAsRepoUser'
}

export interface UpdateHistory {
  action: RequestStatus;
  updatedBy: string;
  updatedByEmail: string;
  updatedAt: string;
}
