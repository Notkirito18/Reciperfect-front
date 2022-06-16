import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  checkPasswordsMatching,
  passwordValidator,
  validInput,
} from 'src/app/helpers';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(15),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordValidator]],
        confirmPassword: ['', [Validators.required, this.passwordValidator]],
      },
      { validators: [this.checkPasswordsMatching] }
    );
  }

  onFormSubmit(
    { username, email, password }: any,
    formDirective: FormGroupDirective
  ) {
    this.authService.register(username, email, password).subscribe(
      ({ body }) => {
        this.router.navigate(['/']);
        this.authService.notification.next({
          msg: 'welcome ' + body.username,
          type: 'notError',
        });
      },
      (error) => {
        this.registerForm.reset();
        formDirective.resetForm();
        this.authService.notification.next({
          msg: error.error.msg,
          type: 'error',
        });
        console.log(error);
      }
    );
  }

  checkPasswordsMatching = checkPasswordsMatching;
  passwordValidator = passwordValidator;
  validInput = validInput;
}
