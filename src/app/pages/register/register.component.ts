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
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private globals: GlobalsService,
    private router: Router
  ) {}

  registerForm!: FormGroup;
  loading = false;

  ngOnInit(): void {
    //header
    this.globals.headerTransparency.next(false);
    //initialising form
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
    this.loading = true;
    this.registerForm.reset();
    formDirective.resetForm();
    this.authService.register(username, email, password).subscribe(
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
