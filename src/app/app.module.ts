import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import { NewAccountComponent } from './page-content/home/new-account/new-account.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule, MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import { RequestsComponent } from './page-content/requests/requests.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {HumanCase} from './shared/human-case.pipe';
import { RequestConfirmComponent } from './page-content/requests/request-confirm/request-confirm.component';
import {MatListModule} from '@angular/material/list';
import {SplitIntoNewLines} from './shared/split-into-newlines.pipe';
import { RequestStatusDetailsComponent } from './page-content/requests/request-status-details/request-status-details.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ToDateObj} from './shared/toDateObj.pipe';









@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    PageContentComponent,
    SettingsComponent,
    AccountInfoComponent,
    NewAccountComponent,
    RequestsComponent,
    HumanCase,
    RequestConfirmComponent,
    SplitIntoNewLines,
    RequestStatusDetailsComponent,
    ToDateObj
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AmplifyAngularModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    MatRadioModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [AuthService, LoggingService, LoaderService, AmplifyService],
  bootstrap: [AppComponent],
  entryComponents: [NewAccountComponent, RequestConfirmComponent, RequestStatusDetailsComponent]
})
export class AppModule {
}
