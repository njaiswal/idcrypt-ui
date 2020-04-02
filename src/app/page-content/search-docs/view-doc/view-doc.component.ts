import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DocImage} from '../../model/document.model';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-view-doc',
  templateUrl: './view-doc.component.html',
  styleUrls: ['./view-doc.component.scss']
})
export class ViewDocComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewDocComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DocImage,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getImageData() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${this.data.contentType};base64, ${this.data.base64Content}`);
  }
}
