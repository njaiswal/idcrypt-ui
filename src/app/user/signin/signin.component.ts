import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Data, Params} from '@angular/router';
import {LoggingService} from '../../shared/logging.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('usrForm', {static: true}) form: NgForm;
  // usernameAttributes = 'email';
  username: any;
  displayStaticAlert = false;

  signUpConfig = {
    hideAllDefaults: true,
    signUpFields: [
      {
        label: 'Username',
        key: 'username',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 2,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 3,
        type: 'password'
      }
    ]
  };

  constructor(private activateRoute: ActivatedRoute, private logger: LoggingService) {
  }

  ngOnInit() {
    this.activateRoute.queryParams
      .subscribe(
        (queryParams: Params) => {
          this.username = queryParams.username;
          this.displayStaticAlert = true;
        }
      );
  }
}
