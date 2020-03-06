import {Component, OnInit} from '@angular/core';
import {AlertBox, AlertType} from '../model/alert-box.model';
import {BackendService} from '../../shared/backend.service';
import {LoggingService} from '../../shared/logging.service';
import {LoaderService} from '../../shared/loader.service';
import {AuthService} from '../../user/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AppStateService} from '../../shared/app-state.service';
import {Account, NewRepo} from '../model/account.model';
import {ManageUsersList, Repo, UserListType} from '../model/repo.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NewRepoComponent} from './new-repo/new-repo.component';
import {ManageUserListComponent} from './manage-user-list/manage-user-list.component';
import {NewAppRequest, RequestType} from '../model/request.model';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReposComponent implements OnInit {
  myAccount: Account;
  amAccountOwner: boolean;

  alertBox: AlertBox = {
    type: AlertType.success,
    message: '',
    display: false
  };
  repoCount = 0;
  dataSource: MatTableDataSource<Repo>;

  columnsToDisplay = ['name', 'desc'];
  expandedElement: Repo | null;


  constructor(private backendService: BackendService,
              private loggingService: LoggingService,
              private loaderService: LoaderService,
              private authService: AuthService,
              private dialog: MatDialog,
              private appStateService: AppStateService) {
  }

  ngOnInit() {
    this.appStateService.currentMyAccount.subscribe((account: Account) => this.myAccount = account);
    this.appStateService.isAccountOwner.subscribe((amAccountOwner: boolean) => this.amAccountOwner = amAccountOwner);

    this.refreshReposTable();
  }

  refreshReposTable() {
    this.loaderService.display(true);
    this.backendService.getMyRepos()
      .then((response: Repo[]) => {
        this.repoCount = response.length;
        this.dataSource = new MatTableDataSource<Repo>(response);
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

  manageUserList(manageUsersList: ManageUsersList, category: UserListType, repo: Repo) {
    const dialogRef = this.dialog.open(ManageUserListComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: manageUsersList,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const request: NewAppRequest = {
          accountId: this.myAccount.accountId,
          requestType: category === UserListType.approvers ?
            (result.action === 'add' ? RequestType.joinAsRepoApprover : RequestType.leaveAsRepoApprover) :
            (result.action === 'add' ? RequestType.grantRepoAccess : RequestType.removeRepoAccess),
          requestedOnResource: repo.repoId
        };

        if (this.amAccountOwner) {
          request.requesteeEmail = result.email;
        }

        this.loaderService.display(true);
        this.backendService.submitRequest(request)
          .then(response => {
            this.alertBox = {
              type: AlertType.success,
              display: true,
              message: 'Request to ' + result.action + ' \'' + result.email +
                '\' as \'Repository ' + (category === UserListType.approvers ? 'Approver' : 'User') +
                '\' has been submitted. All requests need approval before being actioned on.'
            };
          }).catch(err => {
          const errMessage = 'schema_errors' in err.response.data ?
            JSON.stringify(err.response.data.schema_errors, null, 4) : err.response.data.message;
          this.alertBox = {
            type: AlertType.danger,
            display: true,
            message: errMessage
          };
        }).finally(() => this.loaderService.display(false));
      }
    });
  }

  onManageApprovers(repo: Repo): void {
    const manageUsersList: ManageUsersList = {
      category: UserListType.approvers,
      list: repo.approvers,
    };

    this.manageUserList(manageUsersList, UserListType.approvers, repo);
  }

  onManageUsers(repo: Repo): void {
    const manageUsersList: ManageUsersList = {
      category: UserListType.users,
      list: repo.users
    };

    this.manageUserList(manageUsersList, UserListType.users, repo);
  }

  openCreateRepoDialog(): void {
    const dialogRef = this.dialog.open(NewRepoComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: NewRepo) => {
      console.log('The new account dialog was closed');
      if (result != null) {
        this.onNewRepo(result);
      }
    });
  }

  onNewRepo(newRepo: NewRepo) {
    this.loggingService.info('New Repo creation event');
    this.loaderService.display(true);
    this.backendService.createRepo(newRepo).then((response: Repo) => {
      this.alertBox = {
        type: AlertType.success,
        display: true,
        message: 'Repo created: ' + response.name
      };
    }).catch(err => {
      const errMessage = 'schema_errors' in err.response.data ?
        JSON.stringify(err.response.data.schema_errors, null, 4) : err.response.data.message;
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: errMessage
      };
    }).finally(() => {
        this.refreshReposTable();
        this.loaderService.display(false);
      }
    );
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
