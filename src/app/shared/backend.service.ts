import {Injectable} from '@angular/core';
import Auth from '@aws-amplify/auth';
import {API} from 'aws-amplify';
import {NewAccount, Status} from '../page-content/model/account.model';
import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class BackendService {
  apiName;
  env;

  constructor() {
    this.apiName = 'backend';
    this.env = environment.env;
  }

  async createAccount(account: NewAccount) {
    const path = '/account/';
    return API.post(this.apiName, path, {
      headers: await this.getHeaders(),
      body: account
    });
  }

  async getMyAccounts() {
    const path = '/accounts/';
    return API.get(this.apiName, path, {
      headers: await this.getHeaders()
    });
  }

  async setMyAccountStatus(accountId: string, newStatus: Status) {
    const path = '/account/' + accountId;
    return API.put(this.apiName, path, {
      headers: await this.getHeaders(),
      queryStringParameters: {
        status: newStatus
      },
    });
  }

  async getHeaders() {
    const authToken = `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`;
    const headers = {
      Authorization: authToken,
    };

    return headers;
  }
}
