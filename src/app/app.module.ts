import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from './page-content/sidebar/sidebar.component';
import {HomeComponent} from './page-content/home/home.component';
import {SigninComponent} from './user/signin/signin.component';
import {AuthService} from './user/auth.service';
import {LoggingService} from './shared/logging.service';
import {LoaderService} from './shared/loader.service';
import {PageContentComponent} from './page-content/page-content.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { SettingsComponent } from './page-content/settings/settings.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import {HttpClientModule} from '@angular/common/http';
import { AccountInfoComponent } from './page-content/home/account-info/account-info.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    SigninComponent,
    PageContentComponent,
    SettingsComponent,
    AccountInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AmplifyAngularModule,
    ModalModule.forRoot()
  ],
  providers: [AuthService, LoggingService, LoaderService, AmplifyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
