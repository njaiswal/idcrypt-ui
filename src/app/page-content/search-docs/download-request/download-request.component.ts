import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Doc} from '../../model/document.model';

@Component({
  selector: 'app-download-request',
  templateUrl: './download-request.component.html',
  styleUrls: ['./download-request.component.scss']
})
export class DownloadRequestComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DownloadRequestComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Doc) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
