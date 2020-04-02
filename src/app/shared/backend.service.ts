import {Injectable} from '@angular/core';
import Auth from '@aws-amplify/auth';
import {API} from 'aws-amplify';
import {NewAccount, NewRepo, Status} from '../page-content/model/account.model';
import {environment} from '../../environments/environment';
import {AppRequest, NewAppRequest} from '../page-content/model/request.model';
import {Doc, NewDoc, SearchDoc} from '../page-content/model/document.model';


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

  async createNewDoc(newDoc: NewDoc) {
    const path = '/docs/';
    return API.post(this.apiName, path, {
      headers: await this.getHeaders(),
      body: newDoc
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

  async downloadDoc(doc: Doc) {
    const path = `/docs/download?accountId=${doc.accountId}&repoId=${doc.repoId}&docId=${doc.docId}`;
    return API.get(this.apiName, path, {
      headers: await this.getHeaders()
    });
  }

  async getDocs(searchDoc: SearchDoc) {
    let path = '/docs/?accountId=' + searchDoc.accountId + '&repoId=' + searchDoc.repoId;

    if (searchDoc.text !== undefined && searchDoc.text.length > 2) {
      path = path + '&text=' + searchDoc.text;
    }

    if (searchDoc.name !== undefined && searchDoc.name.length > 2) {
      path = path + '&name=' + searchDoc.name;
    }

    if (searchDoc.downloadable) {
      path = path + '&downloadable=true';
    }

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
