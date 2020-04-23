import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DocImage} from '../../model/document.model';
import {DomSanitizer} from '@angular/platform-browser';
import {PDFProgressData} from 'ng2-pdf-viewer';
import {LoaderService} from '../../../shared/loader.service';

@Component({
  selector: 'app-view-doc',
  templateUrl: './view-doc.component.html',
  styleUrls: ['./view-doc.component.scss']
})
export class ViewDocComponent implements OnInit {

  docLoaderProgressPct = 100;

  constructor(public dialogRef: MatDialogRef<ViewDocComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DocImage,
              private sanitizer: DomSanitizer,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getImageData() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${this.data.contentType};base64, ${this.data.base64Content}`);
  }

  onPdfLoadProgress(progressData: PDFProgressData) {
    this.docLoaderProgressPct = Math.abs(progressData.loaded / progressData.total) * 100;
  }
}
