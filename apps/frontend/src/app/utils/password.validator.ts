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

/*
  REFERENCE CODE (FOR IMPLEMENTING SCORE BASED PASSWORD VALIDATION)
*/
// const score = validator.isStrongPassword(value, {
//   ...PasswordValidationRules,
//   returnScore: true,
// });

// const criteriaStatus: PasswordCriteriaStatus = checkPasswordCriteria(value);

// // Hard-coded strong min (calculated from @repo/shared/password-rules)
// if (score < 80) {
//   return {
//     score,
//     criteriaStatus,
//   };
// }
// return null;
