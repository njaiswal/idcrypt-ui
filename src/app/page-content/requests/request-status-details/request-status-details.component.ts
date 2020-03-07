import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AppRequest} from '../../model/request.model';

@Component({
  selector: 'app-request-status-details',
  templateUrl: './request-status-details.component.html',
  styleUrls: ['./request-status-details.component.scss']
})
export class RequestStatusDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RequestStatusDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AppRequest) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
