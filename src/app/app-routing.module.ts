import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './page-content/home/home.component';
import {SigninComponent} from './user/signin/signin.component';
import {AuthGuard} from './user/auth-guard.service';
import {PageContentComponent} from './page-content/page-content.component';
import {SettingsComponent} from './page-content/settings/settings.component';
import {RequestsComponent} from './page-content/requests/requests.component';


const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], component: PageContentComponent, children: [
      {path: 'home', component: HomeComponent},
      {path: 'requests', component: RequestsComponent},
      {path: 'archived-requests', component: RequestsComponent},
      {path: 'settings', component: SettingsComponent}
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
