import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertBox, AlertType} from '../model/alert-box.model';
import {BackendService} from '../../shared/backend.service';
import {LoggingService} from '../../shared/logging.service';
import {LoaderService} from '../../shared/loader.service';
import {AuthService} from '../../user/auth.service';
import {AppRequest} from '../model/request.model';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RequestConfirmComponent} from './request-confirm/request-confirm.component';
import {Account} from '../model/account.model';
import {AppStateService} from '../../shared/app-state.service';
import {RequestStatusDetailsComponent} from './request-status-details/request-status-details.component';
import {Router} from '@angular/router';
import {HumanCase} from '../../shared/human-case.pipe';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {User} from '../../user/user.model';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequestsComponent implements OnInit {
  myAccount: Account;
  amAccountOwner: boolean;
  loggedInUser: User;

  columnsToDisplay: string[] = ['requestType', 'requestedOnResourceName', 'requesteeEmail', 'status', 'createdAt'];
  dataSource: MatTableDataSource<AppRequest>;
  expandedElement: AppRequest | null;

  requestCount = 0;
  humanCase: HumanCase = new HumanCase();

  filterInput: string;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  alertBox: AlertBox = {
    type: AlertType.success,
    message: '',
    display: false
  };

  constructor(private backendService: BackendService,
              private loggingService: LoggingService,
              private loaderService: LoaderService,
              private authService: AuthService,
              private dialog: MatDialog,
              private appStateService: AppStateService,
              private router: Router) {
  }

  ngOnInit() {
    this.appStateService.currentMyAccount.subscribe((account: Account) => this.myAccount = account);
    this.appStateService.isAccountOwner.subscribe((amAccountOwner: boolean) => this.amAccountOwner = amAccountOwner);
    this.loggedInUser = this.authService.getLoggedInUser();


    this.refreshRequestsTable();
  }

  refreshRequestsTable() {
    this.loaderService.display(true);
    this.backendService.getMyRequests()
      .then((response: AppRequest[]) => {
        this.requestCount = response.length;
        this.dataSource = new MatTableDataSource<AppRequest>(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }).catch(err => {
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: err.response.data.message
      };
    }).finally(() => {
      this.loaderService.display(false);
      this.filterInput = null;
    });
  }

  openUpdateHistoryDialog(appRequest: AppRequest): void {
    const dialogRef = this.dialog.open(RequestStatusDetailsComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: appRequest
    });
  }

  openConfirmDialog(answer: string, appRequest: AppRequest): void {
    const dialogRef = this.dialog.open(RequestConfirmComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: {selected: appRequest, action: answer}
    });

    dialogRef.afterClosed().subscribe((result: { selected: AppRequest, action: string }) => {
      if (result != null) {
        this.loaderService.display(true);

        this.backendService.changeRequestStatus(result.selected, result.action)
          .then((response: AppRequest) => {
            this.alertBox = {
              type: AlertType.success,
              message: '\'' + this.humanCase.transform(response.requestType) + '\' for \'' +
                response.requesteeEmail + '\' successfully marked as ' + response.status,
              display: true
            };
          })
          .catch(err => {
            this.alertBox = {
              type: AlertType.danger,
              display: true,
              message: result.selected.requestType + ' for ' + result.selected.requesteeEmail + ': ' + err.response.data.message
            };
          })
          .finally(() => {
            this.refreshRequestsTable();
            this.loaderService.display(false);
          });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
