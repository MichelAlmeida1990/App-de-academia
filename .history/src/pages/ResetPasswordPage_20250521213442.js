// src/pages/ResetPasswordPage.js
import React from 'react';
import ResetPassword from '../components/auth/ResetPassword';
import AuthLayout from '../components/layout/AuthLayout';

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <ResetPassword />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
