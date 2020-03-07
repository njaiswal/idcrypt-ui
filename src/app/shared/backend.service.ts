import {Injectable} from '@angular/core';
import Auth from '@aws-amplify/auth';
import {API} from 'aws-amplify';
import {NewAccount, NewRepo, Status} from '../page-content/model/account.model';
import {environment} from '../../environments/environment';
import {AppRequest, NewAppRequest} from '../page-content/model/request.model';


@Injectable({providedIn: 'root'})
export class BackendService {
  apiName;
  env;

  constructor() {
    this.apiName = 'backend';
    this.env = environment.env;
  }

  async submitRequest(request: NewAppRequest) {
    const path = '/requests/';
    return API.post(this.apiName, path, {
      headers: await this.getHeaders(),
      body: request
    });
  }

  async createAccount(account: NewAccount) {
    const path = '/account/';
    return API.post(this.apiName, path, {
      headers: await this.getHeaders(),
      body: account
    });
  }

  async createRepo(repo: NewRepo) {
    const path = '/repos/';
    return API.post(this.apiName, path, {
      headers: await this.getHeaders(),
      body: repo
    });
  }

  async getAccountMembership(accountId: string) {
    const path = '/account/' + accountId + '/members';
    return API.get(this.apiName, path, {
      headers: await this.getHeaders()
    });
  }

  async getMyRepos() {
    const path = '/repos/';
    return API.get(this.apiName, path, {
      headers: await this.getHeaders()
    });
  }

  async getMyRequests() {
    const path = '/requests/';
    return API.get(this.apiName, path, {
      headers: await this.getHeaders()
    });
  }

  async changeRequestStatus(request: AppRequest, newStatus: string) {
    const path = '/requests/?status=' + newStatus;
    return API.put(this.apiName, path, {
      headers: await this.getHeaders(),
      body: {
        accountId: request.accountId,
        requestId: request.requestId
      }
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
