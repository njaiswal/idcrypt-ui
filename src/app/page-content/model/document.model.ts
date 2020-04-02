export class DocImage {
  public name: string;
  public base64Content: string;
  public contentType: string;
}

export class SearchDoc {
  public accountId: string;
  public repoId: string;
  public text?: string;
  public name?: string;
  public downloadable?: boolean;
}

export class NewDoc {
  public accountId: string;
  public repoId: string;
  public name: string;
}

export class Doc {
  docId: string;
  repoId: string;
  accountId: string;
  retention: number;
  status: DocStatus;
  uploadedBy: string;
  uploadedByEmail: string;
  downloadableBy: string[];
  downloadable?: boolean;
  docType: DocType;
  text: string;
  name: string;
  createdAt: string;
  errorMessage: string;
  imageFile?: any;
  contentType?: string;
  photoUrl?: any;
  hasPhoto?: boolean;
}

export enum DocStatus {
  initialized = 'initialized',
  beingProcessed = 'beingProcessed',
  expired = 'expired',
  failed = 'failed',
  successfullyProcessed = 'successfullyProcessed'
}

export enum DocType {
  passport = 'passport',
  nationalIdCard = 'nationalIdCard',
  drivingLicence = 'drivingLicence',
  bankStatement = 'bankStatement',
  utilityBill = 'utilityBill',
  other = 'other'
}
