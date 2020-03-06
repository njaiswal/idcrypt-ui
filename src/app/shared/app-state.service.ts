import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Account} from '../page-content/model/account.model';

@Injectable({providedIn: 'root'})
export class AppStateService {

  private iAmAccountOwner = new BehaviorSubject<boolean>(null);
  isAccountOwner = this.iAmAccountOwner.asObservable();

  private myAccount = new BehaviorSubject<Account>(null);
  currentMyAccount = this.myAccount.asObservable();

  constructor() {
  }

  setIAmAccountOwner(flag: boolean) {
    this.iAmAccountOwner.next(flag);
  }

  setMyAccount(account: Account) {
    this.myAccount.next(account);
  }
}
