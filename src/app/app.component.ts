import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './user/auth.service';
import {LoggingService} from './shared/logging.service';
import {LoaderService} from './shared/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showLoader: boolean;
  isAuthenticated = false;
  isCollapsed = true;

  constructor(private  authService: AuthService,
              private router: Router,
              private logger: LoggingService,
              private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    // Subscribe to authentication change events
    this.authService.authStatusChanged.subscribe(
      (authenticated) => {
        this.logger.info('Authentication status change to: ' + authenticated);
        this.isAuthenticated = authenticated;
        if (authenticated) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    );
    this.authService.initAuth();

    // Subscribe to loader service status
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
