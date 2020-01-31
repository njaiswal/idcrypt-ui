import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild('usrForm', {static: true}) form: NgForm;
  didFail = false;
  failureMessage = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );

    this.authService.authFailMessage.subscribe(
      (failureMessage: string) => this.failureMessage = failureMessage
    );

  }

  onSubmit() {
    const usrName = this.form.value.username;
    const password = this.form.value.password;
    this.authService.signIn(usrName, password);
  }
}
