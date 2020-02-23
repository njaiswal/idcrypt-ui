import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Account} from '../page-content/model/account.model';

@Injectable({providedIn: 'root'})
export class AppStateService {

  private ownedAccount = new BehaviorSubject<Account>(null);
  currentOwnedAccount = this.ownedAccount.asObservable();


  constructor() {
  }

  setOwnedAccount(account: Account) {
    this.ownedAccount.next(account);
  }
}
