import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewRepo} from '../../model/account.model';

@Component({
  selector: 'app-new-repo',
  templateUrl: './new-repo.component.html',
  styleUrls: ['./new-repo.component.scss']
})
export class NewRepoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewRepoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NewRepo) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
