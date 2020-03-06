import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Feature} from '../model/feature.model';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent {

  constructor(public dialogRef: MatDialogRef<ComingSoonComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Feature) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
