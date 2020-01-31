import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from './page-content/sidebar/sidebar.component';
import {HomeComponent} from './page-content/home/home.component';
import {SigninComponent} from './user/signin/signin.component';
import {SignupComponent} from './user/signup/signup.component';
import {AuthService} from './user/auth.service';
import {LoggingService} from './shared/logging.service';
import {LoaderService} from './shared/loader.service';
import {PageContentComponent} from './page-content/page-content.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RecaptchaFormsModule, RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings} from 'ng-recaptcha';
import {ValidateComponent} from './user/validate/validate.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    PageContentComponent,
    ValidateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [AuthService, LoggingService, LoaderService, {
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: '6Lckr9QUAAAAAO57BPwtRAzSFKnFNU9OiEgvccPP',
      size: 'normal'
    } as RecaptchaSettings,
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
