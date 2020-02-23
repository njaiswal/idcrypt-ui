import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AppRequest} from '../../model/request.model';

@Component({
  selector: 'app-request-confirm',
  templateUrl: './request-confirm.component.html',
  styleUrls: ['./request-confirm.component.scss']
})
export class RequestConfirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RequestConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { action: string, selected: AppRequest[] }) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
