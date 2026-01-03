'use client';

import ForgotPasswordForm from '@/components/AuthForms/ForgotPasswordForm';
import React from 'react';

const page = () => {
  return <ForgotPasswordForm defaultValues={{ email: '' }} />;
};

export default page;
