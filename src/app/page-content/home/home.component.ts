import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendService} from '../../shared/backend.service';
import {LoggingService} from '../../shared/logging.service';
import {LoaderService} from '../../shared/loader.service';
import {User} from '../../user/user.model';
import {AuthService} from '../../user/auth.service';
import {Account, NewAccount, Status} from '../model/account.model';
import {NewAppRequest, RequestType} from '../model/request.model';
import {AlertBox, AlertType} from '../model/alert-box.model';
import {MatDialog, MatTabGroup} from '@angular/material';
import {AppStateService} from '../../shared/app-state.service';
import {NewAccountComponent} from './new-account/new-account.component';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;

  loggedInUser: User;
  selectedAccountId;

  alertBox: AlertBox = {
    type: AlertType.success,
    message: '',
    display: false
  };

  sameDomainAccounts: Account[] = [];
  myAccount: Account;
  amAccountOwner: boolean;

  constructor(
    private backendService: BackendService,
    private loggingService: LoggingService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private dialog: MatDialog,
    private appStateService: AppStateService) {
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.appStateService.currentMyAccount.subscribe((account: Account) => this.myAccount = account);
    this.appStateService.isAccountOwner.subscribe((amAccountOwner: boolean) => this.amAccountOwner = amAccountOwner);

    this.loaderService.display(true);

    this.backendService.getMyAccounts()
      .then((response: Account[]) => {
        for (const account of response) {
          if (account.owner === this.loggedInUser.email) {
            this.appStateService.setMyAccount(account);
            this.appStateService.setIAmAccountOwner(true);
            break;  // Only one owner account is expected
          } else if (account.members.includes(this.loggedInUser.email)) {
            this.appStateService.setMyAccount(account);
            this.appStateService.setIAmAccountOwner(false);
          } else if (account.domain === this.loggedInUser.email.split('@')[1]) {
            this.sameDomainAccounts.push(account);
          }
        }
        this.loaderService.display(false);
      }).catch(err => {
      this.loggingService.error(JSON.stringify(err, null, 4));
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: err.response.data.message
      };
      this.loaderService.display(false);
    }).finally(() => {
        if (this.tabGroup !== undefined) {
          this.tabGroup.selectedIndex = 0;
        }
      }
    )
    ;
  }

  openDialog(): void {
    const newAccount: NewAccount = {name: null, repo: { name: null, desc: null, retention: null}};

    const dialogRef = this.dialog.open(NewAccountComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: newAccount
    });

    dialogRef.afterClosed().subscribe((result: NewAccount) => {
      console.log('The new account dialog was closed');
      if (result != null) {
        this.onNewAccount(result);
      }
    });
  }

  onNewAccount(account) {
    this.loggingService.info('New account creation event');
    this.loaderService.display(true);
    this.backendService.createAccount(account).then((response: Account) => {
      this.alertBox = {
        type: AlertType.success,
        display: true,
        message: 'Account created: ' + response.name
      };
      this.appStateService.setMyAccount(response);
      this.appStateService.setIAmAccountOwner(true);
      this.loaderService.display(false);
    }).catch(err => {
      const errMessage = 'schema_errors' in err.response.data ?
        JSON.stringify(err.response.data.schema_errors, null, 4) : err.response.data.message;
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: errMessage
      };
      this.loaderService.display(false);
    });
  }

  onJoinAccount() {
    if (this.selectedAccountId == null) {
      this.alertBox = {
        type: AlertType.info,
        display: true,
        message: 'Please select a Account to join.'
      };
    }

    const joinAccountRequest: NewAppRequest = {
      accountId: this.selectedAccountId,
      requestType: RequestType.joinAccount,
      requestedOnResource: this.selectedAccountId
    };

    this.loaderService.display(true);
    this.backendService.submitRequest(joinAccountRequest)
      .then(response => {
        this.alertBox = {
          type: AlertType.success,
          display: true,
          message: 'Request to join account submitted. Owner of the account will be notified for approval.'
        };
        this.loaderService.display(false);
      }).catch(err => {
      const errMessage = 'schema_errors' in err.response.data ?
        JSON.stringify(err.response.data.schema_errors, null, 4) : err.response.data.message;
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: errMessage
      };
      this.loaderService.display(false);
    });
  }

  setAccountStatus(status: Status) {
    this.loaderService.display(true);
    this.backendService.setMyAccountStatus(this.myAccount.accountId, status)
      .then((response: Account) => {
        this.alertBox = {
          type: AlertType.success,
          display: true,
          message: 'Account marked ' + status + '. Please check your email for further available actions.'
        };
        this.appStateService.setMyAccount(response);
        this.loaderService.display(false);
      }).catch(err => {
      this.loggingService.error('Account update response: ' + JSON.stringify(err, null, 4));
      const errMessage = 'schema_errors' in err.response.data ?
        JSON.stringify(err.response.data.schema_errors, null, 4) : err.response.data.message;
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: errMessage
      };
      this.loaderService.display(false);
    });
  }

  onActivateAccount() {
    this.setAccountStatus(Status.active);
  }

  onDeactivateAccount() {
    this.setAccountStatus(Status.inactive);
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
