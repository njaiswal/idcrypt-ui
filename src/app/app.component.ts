import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './user/auth.service';
import {LoggingService} from './shared/logging.service';
import {LoaderService} from './shared/loader.service';
import {AmplifyService} from 'aws-amplify-angular';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showLoader: boolean;
  isCollapsed = true;

  signedIn: boolean;
  user: any;

  mobileQuery: MediaQueryList;
  @ViewChild('snav', {static: false}) snav: MatSidenav;

  private readonly mobileQueryListener: () => void;


  constructor(private  authService: AuthService,
              private router: Router,
              private logger: LoggingService,
              private loaderService: LoaderService,
              private amplifyService: AmplifyService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    // Subscribe to authentication change events
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.signedIn = authState.state === 'signedIn';
        if (!authState.user) {
          this.user = null;
        } else {
          this.user = authState.user.attributes;
          this.router.navigate(['/home'])
            .finally(() => this.snav.toggle());
        }
      });

    // Subscribe to loader service status
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  onLogout() {
    // Toggle nav and then call logout
    this.isCollapsed = !this.isCollapsed;
    this.authService.logout();
  }

  onSideNavClick() {
    // If we are on a mobile device close side bar on a side bar link click
    if (this.mobileQuery.matches) {
      this.snav.toggle();
    }
  }


}
