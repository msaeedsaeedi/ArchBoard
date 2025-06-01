import { AbstractControl, ValidatorFn } from '@angular/forms';
import validator from 'validator';
import {
  PasswordValidationRules,
  checkPasswordCriteria,
  PasswordCriteriaStatus,
} from '@repo/shared';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) return null;

    const score = validator.isStrongPassword(value, {
      ...PasswordValidationRules,
      returnScore: true,
    });

    const criteriaStatus: PasswordCriteriaStatus = checkPasswordCriteria(value);

    // Hard-coded strong min (calculated from @repo/shared/password-rules)
    if (score < 80) {
      return {
        score,
        criteriaStatus,
      };
    }
    return null;
  };
}
