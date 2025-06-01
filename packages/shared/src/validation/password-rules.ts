import type { StrongPasswordOptions } from 'validator';

export interface PasswordCriteriaStatus {
  lowercase: boolean;
  uppercase: boolean;
  numeric: boolean;
  minLength: boolean;
}

export function checkPasswordCriteria(password: string): PasswordCriteriaStatus {
  return {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numeric: /\d/.test(password),
    minLength: password.length >= 8,
  };
}

export const PasswordValidationRules: StrongPasswordOptions & { returnScore?: false } = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};
