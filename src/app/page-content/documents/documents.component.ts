import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.openComingSoonDialog();
  }

  openComingSoonDialog(): void {
    const newFeature: Feature = {
      name: 'Documents',
      desc: ['Account members will be able to securely upload and encrypt documents to IDCrypt.',
        'Account members will be able to search and raise requests to download documents as well'
      ]
    };

    const dialogRef = this.dialog.open(ComingSoonComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: newFeature
    });
  }
}
