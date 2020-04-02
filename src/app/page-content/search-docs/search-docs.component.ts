import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertBox, AlertType} from '../model/alert-box.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Account} from '../model/account.model';
import {User} from '../../user/user.model';
import {BackendService} from '../../shared/backend.service';
import {LoggingService} from '../../shared/logging.service';
import {LoaderService} from '../../shared/loader.service';
import {AuthService} from '../../user/auth.service';
import {ErrorStateMatcher, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AppStateService} from '../../shared/app-state.service';
import {Doc, DocImage, SearchDoc} from '../model/document.model';
import {Repo} from '../model/repo.model';
import {DownloadRequestComponent} from './download-request/download-request.component';
import {NewAppRequest, RequestType} from '../model/request.model';
import {ViewDocComponent} from './view-doc/view-doc.component';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-search-docs',
  templateUrl: './search-docs.component.html',
  styleUrls: ['./search-docs.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SearchDocsComponent implements OnInit {
  myAccount: Account;
  amAccountOwner: boolean;
  loggedInUser: User;

  myRepos: Repo[] = [];
  selectedRepoId: string;
  onlyDownloadable: boolean;

  columnsToDisplay: string[] = ['name', 'docType', 'createdAt'];
  dataSource: MatTableDataSource<Doc>;
  expandedElement: Doc | null;
  filterInput: string;
  showTableLoader = false;

  alphaNumericMatcher = new MyErrorStateMatcher();

  nameInputFormControl = new FormControl('', [
    Validators.pattern('^[a-zA-Z ]+$')
  ]);
  textInputFormControl = new FormControl('', [
    Validators.pattern('^[a-zA-Z ]+$')
  ]);


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  alertBox: AlertBox = {
    type: AlertType.success,
    message: '',
    display: false
  };

  docCount = 0;

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
    this.loggedInUser = this.authService.getLoggedInUser();

    this.refreshMyRepos();
  }

  refreshDocsTableOnInputChange() {
    if (this.textInputFormControl.valid && this.nameInputFormControl.valid) {
      this.refreshDocsTable();
    }
  }

  refreshDocsTable() {
    if (this.selectedRepoId === null || this.selectedRepoId === undefined) {
      this.dataSource = new MatTableDataSource<Doc>([]);
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: 'Please select repository'
      };
      return;
    }
    this.loggingService.info('Repository: ' + this.selectedRepoId + ' selected');
    this.alertBox.display = false;

    const searchDoc: SearchDoc = {
      accountId: this.myAccount.accountId,
      repoId: this.selectedRepoId,
      downloadable: this.onlyDownloadable
    };

    if (this.textInputFormControl.value) {
      searchDoc.text = this.textInputFormControl.value;
    }

    if (this.nameInputFormControl.value) {
      searchDoc.name = this.nameInputFormControl.value;
    }

    // this.loaderService.display(true);
    this.showTableLoader = true;
    this.backendService.getDocs(searchDoc)
      .then((response: Doc[]) => {
        this.docCount = response.length;
        this.dataSource = new MatTableDataSource<Doc>(response);
        this.dataSource.paginator = this.paginator;
        // dataSource.sort broken when *ngIf is applied on table to fix flicker
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      }).catch(err => {
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: err.response.data.message
      };
    }).finally(() => {
      // this.loaderService.display(false);
      this.showTableLoader = false;
      this.filterInput = null;
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    });
  }

  refreshMyRepos() {
    this.myRepos.splice(0);
    // Fetch repos on which user has Repo Access Role
    this.loaderService.display(true);
    this.backendService.getMyRepos()
      .then((response: Repo[]) => {
        for (const repo of response) {
          if (repo.users.includes(this.loggedInUser.email)) {
            this.myRepos.push(repo);
          }
        }
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetForm() {
    this.selectedRepoId = null;
    this.nameInputFormControl.setValue(null);
    this.textInputFormControl.setValue(null);
    this.onlyDownloadable = false;
    this.dataSource = new MatTableDataSource<Doc>([]);
  }

  retentionDaysLeft(doc: Doc) {
    const createdAt = new Date(doc.createdAt);
    const now = new Date();
    // @ts-ignore
    const diffTime = Math.abs(now - createdAt);
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysLeft + doc.retention;
  }

  openDownloadRequestDialog(doc: Doc): void {
    const dialogRef = this.dialog.open(DownloadRequestComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: doc
    });

    dialogRef.afterClosed().subscribe((result: Doc) => {
      if (result != null) {
        const request: NewAppRequest = {
          accountId: this.myAccount.accountId,
          requestType: RequestType.grantDocAccess,
          requestedOnResource: doc.repoId + '#' + doc.docId
        };

        this.loaderService.display(true);
        this.backendService.submitRequest(request)
          .then(response => {
            this.alertBox = {
              type: AlertType.success,
              display: true,
              message: 'Request to access document has been submitted. All requests need approval before being actioned on.'
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

  openDocViewDialog(doc: Doc): void {
    this.loaderService.display(true);
    this.backendService.downloadDoc(doc)
      .then((response: DocImage) => {
        this.loaderService.display(false);
        this.dialog.open(ViewDocComponent, {
          width: 'auto',
          position: {top: '5%'},
          data: response
        });
      }).catch(err => {
      const errMessage = 'schema_errors' in err.response.data ?
        JSON.stringify(err.response.data.schema_errors, null, 4) : err.response.data.message;
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: errMessage
      };

    }).finally(() => {
        this.loaderService.display(false);
      }
    );
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
