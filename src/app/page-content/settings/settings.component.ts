import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../user/auth.service';
import {LoggingService} from '../../shared/logging.service';
import {User} from '../../user/user.model';
import {NgForm} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Account} from '../model/account.model';
import {AppStateService} from '../../shared/app-state.service';
import {MatDialog} from '@angular/material';
import {Feature} from '../model/feature.model';
import {ComingSoonComponent} from '../coming-soon/coming-soon.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  myAccount: Account;
  amAccountOwner: boolean;

  @ViewChild('usrForm', {static: true}) form: NgForm;

  user: User;
  authErrorMessage: string = null;
  authSuccessMessage: string = null;
  oldPassword: string;
  newPassword: string;

  modalRef: BsModalRef;

  constructor(
    private authService: AuthService,
    private loggingService: LoggingService,
    private modalService: BsModalService,
    private appStateService: AppStateService,
    private dialog: MatDialog
  ) {
    this.appStateService.currentMyAccount.subscribe((account: Account) => this.myAccount = account);
    this.appStateService.isAccountOwner.subscribe((amAccountOwner: boolean) => this.amAccountOwner = amAccountOwner);
  }

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    this.authService.changePasswordErrorMessage.subscribe((message: string) => this.authErrorMessage = message);
    this.authService.changePasswordSuccessMessage.subscribe((message: string) => this.authSuccessMessage = message);

    this.authService.deleteUserErrorMessage.subscribe((message: string) => this.authErrorMessage = message);
  }

  onChangePassword(oldPassword, newPassword) {
    this.authService.changePassword(oldPassword, newPassword);
  }

  openDeleteUserConfirmationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  confirmDeleteUser(): void {
    this.modalRef.hide();
    this.onDeleteUser();
  }

  declineDeleteUser(): void {
    this.modalRef.hide();
  }

  onDeleteUser() {
    this.authService.deleteUser();
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
