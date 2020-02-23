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
import {NewAccountComponent} from './new-account/new-account.component';
import {AppStateService} from '../../shared/app-state.service';


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
  ownedAccount: Account;

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
    this.appStateService.currentOwnedAccount.subscribe((account: Account) => this.ownedAccount = account);

    this.loaderService.display(true);

    this.backendService.getMyAccounts()
      .then((response: Account[]) => {
        for (const account of response) {
          if (account.owner === this.loggedInUser.sub) {
            this.appStateService.setOwnedAccount(account);
            break;  // Only one owner account is expected
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
    const dialogRef = this.dialog.open(NewAccountComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: {}
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
    this.backendService.createAccount(account).then(response => {
      this.alertBox = {
        type: AlertType.success,
        display: true,
        message: 'Account created: ' + response.name
      };
      this.ownedAccount = response;
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
    this.backendService.setMyAccountStatus(this.ownedAccount.accountId, status)
      .then(response => {
        this.alertBox = {
          type: AlertType.success,
          display: true,
          message: 'Account marked ' + status + '. Please check your email for further available actions.'
        };
        this.ownedAccount = response;
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
}
