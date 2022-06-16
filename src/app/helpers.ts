import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

export function searchClass(scrolled: boolean, screenSize: string): string {
  if (scrolled) {
    switch (screenSize) {
      case 'lg':
        return 'stick-search-lg';
        break;
      case 'md':
        return 'stick-search-lg';
        break;
      case 'sm':
        return 'stick-search-sm';
        break;
      case 'xs':
        return 'stick-search-sm';
        break;
      case 'xl':
        return 'stick-search-lg';
        break;
      default:
        return 'stick-search-lg';
        break;
    }
  } else {
    return '';
  }
}
export const checkPasswordsMatching: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  let pass = group.get('password')!.value;
  let confirmPass = group.get('confirmPassword')!.value;
  return pass === confirmPass ? null : { notSame: true };
};
export function passwordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const pattern = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*s)(?=.{8,})'
  );
  if (!pattern.test(control.value)) {
    return { unvalid: true };
  }
  return null;
}

export const validInput = (
  inputName: string,
  form: FormGroup,
  passMatch?: boolean
): boolean => {
  if (passMatch) {
    return (
      (form.controls['confirmPassword'].invalid &&
        (form.controls['confirmPassword'].dirty ||
          form.controls['confirmPassword'].touched)) ||
      (!form.controls['confirmPassword'].invalid &&
        !form.controls['password'].invalid &&
        !form.controls['email'].invalid &&
        !form.controls['username'].invalid &&
        !form.valid)
    );
  }
  return (
    form.controls[inputName].invalid &&
    (form.controls[inputName].dirty || form.controls[inputName].touched)
  );
};
