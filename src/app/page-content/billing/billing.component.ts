import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.openComingSoonDialog();
  }

  openComingSoonDialog(): void {
    const newFeature: Feature = {
      name: 'Billing',
      desc: ['Who wants billing. Boring...'
      ]
    };

    const dialogRef = this.dialog.open(ComingSoonComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: newFeature
    });

  }

}
