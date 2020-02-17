import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendService} from '../../shared/backend.service';
import {LoggingService} from '../../shared/logging.service';
import {LoaderService} from '../../shared/loader.service';
import {User} from '../../user/user.model';
import {AuthService} from '../../user/auth.service';
import {NgForm} from '@angular/forms';
import {Account, NewAccount, Status, Tier} from '../model/account.model';
import {AlertBox, AlertType} from '../model/alert-box.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('usrForm', {static: false}) form: NgForm;

  loggedInUser: User;

  alertBox: AlertBox = {
    type: AlertType.success,
    message: '',
    display: false
  };

  sameDomainAccounts: Account[] = [];
  ownedAccount: Account = null;

  constructor(
    private backendService: BackendService,
    private loggingService: LoggingService,
    private loaderService: LoaderService, private authService: AuthService) {
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loaderService.display(true);

    this.backendService.getMyAccounts()
      .then((response: Account[]) => {
        for (const account of response) {
          if (account.owner === this.loggedInUser.sub) {
            this.ownedAccount = account;
            break;  // Only one owner account is expected
          } else if (account.domain === this.loggedInUser.email.split('@')[1]) {
            this.sameDomainAccounts.push(account);
          }
        }
        this.loaderService.display(false);
      }).catch(err => {
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: err.response.data.message
      };
      this.loaderService.display(false);
    });
  }

  onNewAccount() {
    const account: NewAccount = {
      name: this.form.value.name,
    };

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
