import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.openComingSoonDialog();
  }

  openComingSoonDialog(): void {
    const newFeature: Feature = {
      name: 'Support',
      desc: ['Currently support is delivered via email, however its nice to have your support tickets in one place.'
      ]
    };

    const dialogRef = this.dialog.open(ComingSoonComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: newFeature
    });

  }

}
