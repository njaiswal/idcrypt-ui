import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Account} from '../../model/account.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  @Input()
  account: Account;

  @Output() deactivateAccount: EventEmitter<any> = new EventEmitter();
  @Output() activateAccount: EventEmitter<any> = new EventEmitter();


  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {
  }

  ngOnInit() {
  }

  openConfirmationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  declineConfirmationModal(): void {
    this.modalRef.hide();
  }

  confirmAccountDeactivation(): void {
    this.modalRef.hide();
    this.deactivateAccount.emit();
  }

  confirmAccountActivation(): void {
    this.modalRef.hide();
    this.activateAccount.emit();
  }

}
