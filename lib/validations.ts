import { z } from 'zod';

export const passwordNotMatchMessage = 'The passwords you entered do not match. Please try again.';
export const passwordRequirementsMessage = 'Your password does not meet the requirements.';
export const emailInvalidMessage = 'Invalid email.';

export const signUpSchema = z
  .object({
    email: z.string().min(1, 'Please enter your email address.').email(emailInvalidMessage),
    password: z
      .string({
        message: passwordRequirementsMessage,
      })
      .min(1, 'Please enter your password.')
      .min(8, passwordRequirementsMessage)
      .refine(value => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value), {
        message: passwordRequirementsMessage,
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms and Privacy Policy.' }),
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: passwordNotMatchMessage,
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.string().min(1, 'Please enter your email address.').email(emailInvalidMessage),
  password: z.string().min(1, 'Please enter your password.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Please enter your email address.').email(emailInvalidMessage),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: passwordRequirementsMessage })
      .min(1, 'Please enter your password.') // required
      .min(8, passwordRequirementsMessage)
      .refine(value => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value), {
        message: passwordRequirementsMessage,
      }),

    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: passwordNotMatchMessage,
    path: ['confirmPassword'],
  });

export const personalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
