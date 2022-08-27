import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

export function capitalCase(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1, s.length);
}

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

export function IdGenerator(): string {
  return (
    '_' +
    Math.random().toString(36).substr(2, 9) +
    new Date().getTime().toString().substr(2, 9)
  );
}

export function ageFromBd(bd: Date | undefined): string {
  if (bd) {
    const date = new Date(bd);
    var diff_ms = Date.now() - date.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970).toString() + ' years old';
  } else {
    return '';
  }
}

export function inputToLink(
  input: string,
  site: 'face' | 'insta' | 'pin'
): string {
  let link = '';
  if (input[input.length - 1] == '/') {
    link = input.slice(0, input.length - 1);
  } else {
    link = input;
  }
  if (input.includes(' ')) {
    link = input.split(' ').join('.');
  }
  if (link.length > 0) {
    if (
      link.includes('facebook.com') ||
      link.includes('instagram.com') ||
      link.includes('pinterest.com')
    ) {
      if (site == 'face') {
        return (
          'https://www.facebook.com/' +
          link.split('/')[link.split('/').length - 1]
        );
      } else if (site == 'insta') {
        return (
          'https://www.instagram.com/' +
          link.split('/')[link.split('/').length - 1]
        );
      } else {
        return (
          'https://www.pinterest.com/' +
          link.split('/')[link.split('/').length - 1]
        );
      }
    } else {
      if (site == 'face') {
        return 'https://www.facebook.com/' + link;
      } else if (site == 'insta') {
        return 'https://www.instagram.com/' + link;
      } else {
        return 'https://www.pinterest.com/' + link;
      }
    }
  } else {
    return link;
  }
}

export function median(arr: number[]) {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => {
      return a - b;
    });
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stop-click-propagation]',
})
export class ClickStopPropagation {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}
export function findCommonElement(array1: any[], array2: any[]) {
  // Loop for array1
  for (let i = 0; i < array1.length; i++) {
    // Loop for array2
    for (let j = 0; j < array2.length; j++) {
      // Compare the element of each and
      // every element from both of the
      // arrays
      if (array1[i] === array2[j]) {
        // Return if common element found
        return true;
      }
    }
  }
  // Return if no common element exist
  return false;
}
