import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Account} from '../model/account.model';
import {AmplifyService} from 'aws-amplify-angular';
import {AuthService} from '../../user/auth.service';
import {User} from '../../user/user.model';
import {AppStateService} from '../../shared/app-state.service';
import {BackendService} from '../../shared/backend.service';
import {Repo} from '../model/repo.model';
import {AlertBox, AlertType} from '../model/alert-box.model';
import {LoaderService} from '../../shared/loader.service';
import {Doc, DocType, NewDoc} from '../model/document.model';
import {ImageCardComponent} from './image-card/image-card.component';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  docName: string;
  hasPhoto = false;
  uploading = false;

  loggedInUser: User;
  myAccount: Account;

  myRepos: Repo[] = [];
  selectedRepoId: string;

  docType: DocType;

  docRows: Doc[] = [];

  alertBox: AlertBox = {
    type: AlertType.success,
    message: '',
    display: false
  };

  constructor(private dialog: MatDialog,
              private amplifyService: AmplifyService,
              private authService: AuthService,
              private appStateService: AppStateService,
              private backendService: BackendService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    // this.openComingSoonDialog();
    this.loggedInUser = this.authService.getLoggedInUser();
    this.appStateService.currentMyAccount.subscribe((account: Account) => this.myAccount = account);
    this.refreshMyRepos();
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

  addDocumentRow() {
    // Make sure repoId is selected.
    if (this.selectedRepoId === null || this.selectedRepoId === undefined) {
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: 'Please select repository'
      };
      return;
    }

    // Make sure customer name was entered
    if (this.docName === null || this.docName === undefined) {
      this.alertBox = {
        type: AlertType.danger,
        display: true,
        message: 'Please enter document holder\'s name'
      };
      return;
    }

    const newDoc: NewDoc = {
      accountId: this.myAccount.accountId,
      repoId: this.selectedRepoId,
      name: this.docName
    };

    // Create a placeholder doc in backend
    this.loaderService.display(true);
    this.backendService.createNewDoc(newDoc)
      .then((response: Doc) => {
        this.docRows.push(response);
        console.log(this.docRows.length);
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
      // this.changeDetectorRef.detectChanges();
    });
  }

  removeDocumentRow(docRow: Doc) {
    const newDocRows: Doc[] = [];
    for (const doc of this.docRows) {
      if (doc.docId !== docRow.docId) {
        newDocRows.push(doc);
      }
    }
    this.docRows = newDocRows;
  }

  // The maximum size of a document that's provided in a blob of bytes is 5 MB. The document bytes must be in PNG or JPEG format.
  // TODO check size and type
  pick(evt, docRow: Doc) {
    const file = evt.target.files[0];
    if (!file) {
      return;
    }

    docRow.contentType = file.type;

    // Create a placeholder doc in backend
    this.loaderService.display(true);
    // Now process the uploaded file
    docRow.imageFile = file;
    const thatRow = docRow;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      const target: any = e.target;
      thatRow.photoUrl = target.result;
      thatRow.hasPhoto = true;
      this.loaderService.display(false);
      // that.loaded.emit(url);
    };
    reader.readAsDataURL(file);
  }

  uploadFiles() {
    this.uploading = true;

    const numberOfDocs = this.docRows.length;
    let numberOfDocsUploaded = 0;

    for (const doc of this.docRows) {
      if (!doc.hasPhoto) {
        continue;
      }

      const s3ImagePath = `${doc.repoId}/${doc.docId}/${doc.docType}`;
      const storageOptions: any = {
        serverSideEncryption: 'AES256',
        level: 'private',
        contentType: doc.contentType
      };

      this.loaderService.display(true);
      this.amplifyService
        .storage()
        .put(s3ImagePath, doc.imageFile, storageOptions)
        .then(result => {
          numberOfDocsUploaded++;
          this.alertBox = {
            type: AlertType.success,
            display: true,
            message: 'Uploaded ' + numberOfDocsUploaded + '/' + numberOfDocs + ' documents.'
          };
          this.removeDocumentRow(doc);
        })
        .catch(error => {
          this.alertBox = {
            type: AlertType.danger,
            display: true,
            message: error
          };
        })
        .finally(() => {
          this.loaderService.display(false);
        });
    }
  }


  onPhotoError() {
    this.hasPhoto = false;
  }


  imageClicked(docRow: Doc) {
    const dialogRef = this.dialog.open(ImageCardComponent, {
      width: 'auto',
      position: {top: '5%'},
      data: docRow
    });
  }

  photosAvailableToUpload() {
    let photosAvailable = false;
    for (const doc of this.docRows) {
      if (doc.hasPhoto) {
        photosAvailable = true;
        break;
      }
    }
    return photosAvailable;
  }
}
