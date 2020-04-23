import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Doc} from '../../model/document.model';
import {PDFProgressData} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss']
})
export class ImageCardComponent implements OnInit {

  docLoaderProgressPct = 100;

  constructor(public dialogRef: MatDialogRef<ImageCardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Doc) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPdfLoadProgress(progressData: PDFProgressData) {
    this.docLoaderProgressPct = Math.abs(progressData.loaded / progressData.total) * 100;
  }
}
