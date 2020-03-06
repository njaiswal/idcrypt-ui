import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './page-content/home/home.component';
import {SigninComponent} from './user/signin/signin.component';
import {AuthGuard} from './user/auth-guard.service';
import {PageContentComponent} from './page-content/page-content.component';
import {SettingsComponent} from './page-content/settings/settings.component';
import {RequestsComponent} from './page-content/requests/requests.component';
import {ReposComponent} from './page-content/repos/repos.component';
import {MembersComponent} from './page-content/members/members.component';
import {DocumentsComponent} from './page-content/documents/documents.component';
import {AdminsComponent} from './page-content/admins/admins.component';
import {ReportsComponent} from './page-content/reports/reports.component';
import {BillingComponent} from './page-content/billing/billing.component';
import {SupportComponent} from './page-content/support/support.component';


const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], component: PageContentComponent, children: [
      {path: 'home', component: HomeComponent},
      {path: 'requests', component: RequestsComponent},
      {path: 'repos', component: ReposComponent},
      {path: 'docs', component: DocumentsComponent},
      {path: 'members', component: MembersComponent},
      {path: 'admins', component: AdminsComponent},
      {path: 'reports', component: ReportsComponent},
      {path: 'billing', component: BillingComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'support', component: SupportComponent}
    ]
  },
  {
    path: 'login', component: SigninComponent, children: [
      {path: ':username', component: SigninComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
