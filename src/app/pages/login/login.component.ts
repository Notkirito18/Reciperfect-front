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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  onFormSubmit({ email, password }: any, formDirective: FormGroupDirective) {
    this.authService.login(email, password).subscribe(
      ({ body }) => {
        this.router.navigate(['/']);
        this.authService.notification.next({
          msg: 'welcome ' + body.username,
          type: 'notError',
        });
      },
      (error) => {
        this.loginForm.reset();
        formDirective.resetForm();
        this.authService.notification.next({
          msg: error.error.msg,
          type: 'error',
        });
        console.log(error);
      }
    );
  }
  validInput = validInput;
}
