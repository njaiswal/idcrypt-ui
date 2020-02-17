export class AlertBox {
  public display: boolean;
  public type: AlertType;
  public message: string;
}

export enum AlertType {
  success = 'success',
  danger = 'danger'
}
