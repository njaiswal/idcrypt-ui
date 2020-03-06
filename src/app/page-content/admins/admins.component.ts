import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.openComingSoonDialog();
  }

  openComingSoonDialog(): void {
    const newFeature: Feature = {
      name: 'Administrators',
      desc: ['Account Owners will be able to create and manage account administrators.',
        'Account Owners will be able to delegate day to day running of account to administrators.'
      ]
    };

    const dialogRef = this.dialog.open(ComingSoonComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: newFeature
    });

  }
}
