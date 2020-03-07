import {Component, OnInit} from '@angular/core';
import {Account, NewAccount} from '../model/account.model';
import {AlertBox, AlertType} from '../model/alert-box.model';
import {AppStateService} from '../../shared/app-state.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {BackendService} from '../../shared/backend.service';
import {LoggingService} from '../../shared/logging.service';
import {LoaderService} from '../../shared/loader.service';
import {AccountMembership} from '../model/member.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';
import {Feature} from '../model/feature.model';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MembersComponent implements OnInit {

  myAccount: Account;
  amAccountOwner: boolean;

  alertBox: AlertBox = {
    type: AlertType.success,
    message: '',
    display: false
  };

  columnsToDisplay: string[] = ['email', 'email_verified'];
  dataSource: MatTableDataSource<AccountMembership>;
  expandedElement: AccountMembership | null;

  constructor(private backendService: BackendService,
              private loggingService: LoggingService,
              private loaderService: LoaderService,
              private appStateService: AppStateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.appStateService.currentMyAccount.subscribe((account: Account) => this.myAccount = account);
    this.appStateService.isAccountOwner.subscribe((amAccountOwner: boolean) => this.amAccountOwner = amAccountOwner);

    this.refreshMembershipTable();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshMembershipTable() {
    this.loaderService.display(true);
    this.backendService.getAccountMembership(this.myAccount.accountId)
      .then((response: AccountMembership[]) => {
        this.dataSource = new MatTableDataSource<AccountMembership>(response);
      }).catch(err => {
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: err.response.data.message
      };
    }).finally(() => {
      this.loaderService.display(false);
    });
  }

  openComingSoonDialog(feature: string, featureDesc: string[]): void {
    const newFeature: Feature = {
      name: feature,
      desc: featureDesc
    };

    const dialogRef = this.dialog.open(ComingSoonComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: newFeature
    });
  }


}
