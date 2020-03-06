import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewAccount} from '../../model/account.model';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})
export class NewAccountComponent {

  constructor(public dialogRef: MatDialogRef<NewAccountComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NewAccount) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
