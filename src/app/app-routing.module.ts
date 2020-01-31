import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './page-content/home/home.component';
import {SigninComponent} from './user/signin/signin.component';
import {SignupComponent} from './user/signup/signup.component';
import {AuthGuard} from './user/auth-guard.service';
import {PageContentComponent} from './page-content/page-content.component';
import {ValidateComponent} from './user/validate/validate.component';


const routes: Routes = [
  {path: '', canActivate: [AuthGuard], component: PageContentComponent, children: [
      {path: 'home', component: HomeComponent},
    ]
  },
  {path: 'login', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'validate', component: ValidateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
