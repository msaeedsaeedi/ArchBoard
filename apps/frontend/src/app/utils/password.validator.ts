import { AbstractControl, ValidatorFn } from '@angular/forms';
import validator from 'validator';
import { PasswordValidationRules } from '@repo/shared';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) return null;

    const isValid = validator.isStrongPassword(value, PasswordValidationRules);
    return isValid ? null : { weakPassword: true };
  };
}
