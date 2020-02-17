import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {map, tap, catchError} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import Amplify, {I18n} from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import {environment} from '../../environments/environment';
import {AmplifyService} from 'aws-amplify-angular';
import {LoggingService} from '../shared/logging.service';
import {User} from './user.model';
import {LoaderService} from '../shared/loader.service';
import {Subject} from 'rxjs';
import {CognitoUser} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {

  public loggedIn: BehaviorSubject<boolean>;
  public loggedInUser: User;
  changePasswordErrorMessage = new Subject<string>();
  changePasswordSuccessMessage = new Subject<string>();

  deleteUserErrorMessage = new Subject<string>();
  deleteUserSuccessMessage = new Subject<string>();


  constructor(private router: Router,
              private amplifyService: AmplifyService,
              private loggingService: LoggingService,
              private loaderService: LoaderService) {
    I18n.setLanguage('en-US');
    I18n.putVocabularies({
      'en-US':
        {
          Email: 'Company Email'
        }
    });

    Amplify.configure(environment.amplify);
    this.loggedIn = new BehaviorSubject<boolean>(false);

    // Subscribe to authState change and update user attributes of logged in user
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        if (authState.state !== 'signedIn' || !authState.user) {
          this.loggedInUser = null;
        } else {
          this.loggedInUser = {
            username: authState.user.username,
            email: authState.user.attributes.email,
            sub: authState.user.attributes.sub
          };
        }
      });
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  /** deletes user */
  public deleteUser() {
    this.loaderService.display(true);
    Auth.currentAuthenticatedUser()
      .then((user: CognitoUser) => new Promise((resolve, reject) => {
        user.deleteUser(error => {
          if (error) {
            this.loaderService.display(false);
            this.deleteUserErrorMessage.next(error.message);
            this.deleteUserSuccessMessage.next(null);
            return reject(error);
          }
          document.location.href = '/login';
          resolve();
        });
      }))
      .catch(err => {
        this.loaderService.display(false);
        this.deleteUserErrorMessage.next(err.message);
        this.deleteUserSuccessMessage.next(null);
      });
  }

  /** ChangePassword */
  public changePassword(oldPassword, newPassword) {
    this.loaderService.display(true);
    Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, oldPassword, newPassword);
      })
      .then(
        data => {
          this.loaderService.display(false);
          this.changePasswordErrorMessage.next(null);
          this.changePasswordSuccessMessage.next('Password successfully updated');
        }
      )
      .catch(err => {
        this.loaderService.display(false);
        this.changePasswordErrorMessage.next(err.message);
        this.changePasswordSuccessMessage.next(null);
      });
  }

  /** get authenticate state */
  public isAuthenticated(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.loggedIn.next(true);
          return true;
        }),
        catchError(error => {
          this.loggedIn.next(false);
          return of(false);
        })
      );
  }

  /** signout */
  public logout() {
    this.loaderService.display(true);
    fromPromise(Auth.signOut())
      .subscribe(
        result => {
          this.loaderService.display(false);
          this.loggedIn.next(false);
          this.router.navigate(['/login']);
        },
        error => {
          this.loaderService.display(false);
          console.log(error);
        }
      );
  }
}
