import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.openComingSoonDialog();
  }

  openComingSoonDialog(): void {
    const newFeature: Feature = {
      name: 'Reports',
      desc: ['View detailed reports on who is using what in your account.'
      ]
    };

    const dialogRef = this.dialog.open(ComingSoonComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: newFeature
    });

  }

}
