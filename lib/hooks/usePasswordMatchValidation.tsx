import { useEffect, useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

/**
 * TODO: Find the actual issue with the validation for matching between password and confirmPassword.
 * NOTE: The validation for matching between password and confirmPassword is not working in SignUp but works in ResetPassword.
 * This is a workaround to ensure that the password and confirmPassword fields are always in sync.
 */
const usePasswordMatchValidation = <T extends FieldValues>(form: UseFormReturn<T>, defaultValues: T) => {
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  const password = Object.keys(defaultValues).includes('password') ? form.watch('password' as Path<T>) : null;
  const confirmPassword = Object.keys(defaultValues).includes('confirmPassword')
    ? form.watch('confirmPassword' as Path<T>)
    : null;

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
      form.trigger('confirmPassword' as Path<T>);
    } else {
      setPasswordsMatch(null);
    }
  }, [password, confirmPassword, form]);

  return passwordsMatch;
};

export default usePasswordMatchValidation;
