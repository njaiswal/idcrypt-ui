import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './user/auth.service';
import {LoggingService} from './shared/logging.service';
import {LoaderService} from './shared/loader.service';
import {AmplifyService} from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showLoader: boolean;
  isAuthenticated = false;
  isCollapsed = true;

  signedIn: boolean;
  user: any;


  constructor(private  authService: AuthService,
              private router: Router,
              private logger: LoggingService,
              private loaderService: LoaderService,
              private amplifyService: AmplifyService) {
  }

  ngOnInit(): void {
    // Subscribe to authentication change events
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.signedIn = authState.state === 'signedIn';
        if (!authState.user) {
          this.user = null;
          this.isAuthenticated = false;
        } else {
          this.user = authState.user;
          this.isAuthenticated = true;
          this.router.navigate(['/home']);
        }
      });

    // Subscribe to loader service status
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }

  onLogout() {
    // Toggle nav and then call logout
    this.isCollapsed = !this.isCollapsed;
    this.authService.logout();
  }
}
