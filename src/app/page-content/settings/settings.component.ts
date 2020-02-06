import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AuthService} from '../../user/auth.service';
import {LoggingService} from '../../shared/logging.service';
import {User} from '../../user/user.model';
import {NgForm} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('usrForm', {static: true}) form: NgForm;

  user: User;
  authErrorMessage: string = null;
  authSuccessMessage: string = null;
  oldPassword: string;
  newPassword: string;

  modalRef: BsModalRef;

  constructor(private authService: AuthService, private loggingService: LoggingService, private modalService: BsModalService) {
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

}
