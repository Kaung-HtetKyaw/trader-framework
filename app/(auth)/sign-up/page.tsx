'use client';
import SignUpForm from '@/components/AuthForms/SignUpForm';
import { signUpWithCredentials } from '@/lib/authClient';
import { signUpSchema } from '@/lib/validations';
import React from 'react';
import { z } from 'zod';

export type SignUpFormPayload = z.infer<typeof signUpSchema>;

const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
};

const page = () => {
  return <SignUpForm defaultValues={defaultValues as SignUpFormPayload} onSubmit={signUpWithCredentials} />;
};

export default page;
