import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertBox, AlertType} from '../model/alert-box.model';
import {BackendService} from '../../shared/backend.service';
import {LoggingService} from '../../shared/logging.service';
import {LoaderService} from '../../shared/loader.service';
import {AuthService} from '../../user/auth.service';
import {AppRequest} from '../model/request.model';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {RequestConfirmComponent} from './request-confirm/request-confirm.component';
import {Account} from '../model/account.model';
import {AppStateService} from '../../shared/app-state.service';
import {RequestStatusDetailsComponent} from './request-status-details/request-status-details.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  ownedAccount: Account;

  displayedColumns: string[] = ['select', 'requestType', 'requestedOnResourceName', 'requestedByEmail', 'status', 'createdAt'];
  dataSource: MatTableDataSource<AppRequest>;
  selection = new SelectionModel<AppRequest>(true, []);
  requestCount = 0;
  requestStatus = 'pending';

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  alertBoxes: AlertBox[] = [];
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
    if (this.router.url === '/archived-requests') {
      this.requestStatus = 'archived';
    }
    this.appStateService.currentOwnedAccount.subscribe((account: Account) => this.ownedAccount = account);
    this.refreshRequestsTable();
  }

  refreshRequestsTable() {
    this.loaderService.display(true);
    this.backendService.getMyRequests(this.requestStatus)
      .then((response: AppRequest[]) => {
        this.requestCount = response.length;
        this.dataSource = new MatTableDataSource<AppRequest>(response);
        this.dataSource.sort = this.sort;
      }).catch(err => {
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: err.response.data.message
      };
    }).finally(() => {
      this.loaderService.display(false);
      this.selection.clear();
    });
  }

  openUpdateHistoryDialog(appRequest: AppRequest): void {
    const dialogRef = this.dialog.open(RequestStatusDetailsComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: appRequest
    });
  }

  openConfirmDialog(answer: string): void {
    const dialogRef = this.dialog.open(RequestConfirmComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: {selected: this.selection.selected, action: answer}
    });

    dialogRef.afterClosed().subscribe((result: { selected: AppRequest[], action: string }) => {
      if (result != null) {
        // For each selected request do a change status call
        result.selected.forEach(row => {
          this.loaderService.display(true);

          this.backendService.changeRequestStatus(row, result.action)
            .then((response: AppRequest) => {
              this.alertBoxes.push({
                type: AlertType.success,
                message: response.requestType + ' for ' + response.requesteeEmail + ' successfully marked as ' + response.status,
                display: true
              });
            })
            .catch(err => {
              this.alertBoxes.push({
                type: AlertType.danger,
                display: true,
                message: row.requestType + ' for ' + row.requesteeEmail + ': ' + err.response.data.message
              });
            })
            .finally(() => {
              // This can be problematic that we reset selection on every requests completion
              // See if this causes issues when there are large number of selected requests.
              this.refreshRequestsTable();
              this.selection.clear();
              this.loaderService.display(false);
            });
        });
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource == null) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AppRequest): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.requestType + 1}`;
  }


}
