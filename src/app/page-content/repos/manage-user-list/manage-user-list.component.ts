import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ManageUsersList} from '../../model/repo.model';
import {Account} from '../../model/account.model';
import {AppStateService} from '../../../shared/app-state.service';
import {User} from '../../../user/user.model';
import {AuthService} from '../../../user/auth.service';

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnInit {

  loggedInUser: User;
  myAccount: Account;
  amAccountOwner: boolean;

  constructor(public dialogRef: MatDialogRef<ManageUserListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ManageUsersList,
              private appStateService: AppStateService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.appStateService.currentMyAccount.subscribe((account: Account) => this.myAccount = account);
    this.appStateService.isAccountOwner.subscribe((amAccountOwner: boolean) => this.amAccountOwner = amAccountOwner);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
