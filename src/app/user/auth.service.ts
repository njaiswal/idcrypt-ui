import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject, BehaviorSubject} from 'rxjs';

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import {User} from './user.model';
import {LoaderService} from '../shared/loader.service';
import {LoggingService} from '../shared/logging.service';

const POOL_DATA = {
  UserPoolId: 'eu-west-1_SvAZc0JJD',
  ClientId: '555o7j1faa9su3tmctoe26vmdp'
};
const userPool = new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
  authDidFail = new BehaviorSubject<boolean>(false);
  authFailMessage = new BehaviorSubject<string>(null);
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;
  signUpSuccess = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private loaderService: LoaderService, private loggingService: LoggingService) {
  }

  signUp(username: string, email: string, password: string): void {
    this.loaderService.display(true);
    const user: User = {
      username,
      email,
      password
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(user.username, user.password, attrList, null, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authFailMessage.next(err.message);
        this.loaderService.display(false);
        this.loggingService.error(err.message);
        return;
      }
      this.authDidFail.next(false);
      this.authFailMessage.next(null);
      this.loaderService.display(false);
      this.registeredUser = result.user;
      this.signUpSuccess.next(true);
    });
    return;
  }

  confirmUser(username: string, code: string) {
    this.loaderService.display(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitUser = new CognitoUser(userData);
    cognitUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authFailMessage.next(err.message);
        this.loaderService.display(false);
        this.loggingService.error(err);
        return;
      }
      this.authDidFail.next(false);
      this.authFailMessage.next(null);
      this.loaderService.display(false);
      this.router.navigate(['/']);
    });
  }

  signIn(username: string, password: string): void {
    this.loaderService.display(true);
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    const that = this;
    cognitoUser.authenticateUser(authDetails, {
      onSuccess(result: CognitoUserSession) {
        that.authStatusChanged.next(true);
        that.authDidFail.next(false);
        that.authFailMessage.next(null);
        that.loaderService.display(false);
      },
      onFailure(err) {
        that.authStatusChanged.next(false);
        that.authDidFail.next(true);
        that.authFailMessage.next(err.message);
        that.loaderService.display(false);
      }
    });
    return;
  }

  getAuthenticatedUser() {
    return userPool.getCurrentUser();
  }

  logout() {
    this.getAuthenticatedUser().signOut();
    this.authStatusChanged.next(false);

    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        user.getSession((err, session) => {
          if (err) {
            observer.next(false);
          } else {
            if (session.isValid()) {
              observer.next(true);
            } else {
              observer.next(false);
            }
          }
        });
      }
      observer.complete();
    });
    return obs;
  }

  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }
}
