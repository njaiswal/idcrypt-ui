import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  didFail = false;
  failureMessage = null;
  @ViewChild('usrForm', {static: true}) form: NgForm;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );

    this.authService.authFailMessage.subscribe(
      (failureMessage: string) => this.failureMessage = failureMessage
    );

    this.authService.signUpSuccess.subscribe((signUpSuccess) => {
      if (signUpSuccess) {
        this.router.navigate(['validate']);
      }
    });
  }

  onSubmit() {
    const usrName = this.form.value.username;
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.signUp(usrName, email, password);
  }
}
