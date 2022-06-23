import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { validInput } from 'src/app/helpers';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private globals: GlobalsService,
    private router: Router
  ) {}

  loginForm!: FormGroup;
  loading = false;

  ngOnInit(): void {
    //header
    this.globals.headerTransparency.next(false);
    //inittialising form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  onFormSubmit({ email, password }: any, formDirective: FormGroupDirective) {
    this.loading = true;
    this.loginForm.reset();
    formDirective.resetForm();
    this.authService.login(email, password).subscribe(
      ({ body }) => {
        this.loading = false;
        this.router.navigate(['/']);
        this.globals.notification.next({
          msg: 'welcome ' + body.username,
          type: 'notError',
        });
      },
      (error) => {
        this.loading = false;
        this.globals.notification.next({
          msg: error.error.msg
            ? error.error.msg
            : 'Error occured, please try again',
          type: 'error',
        });
        console.log(error);
      }
    );
  }
  validInput = validInput;
}
