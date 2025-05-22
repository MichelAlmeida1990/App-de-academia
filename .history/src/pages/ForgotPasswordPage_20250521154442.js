// src/pages/ForgotPasswordPage.js
import React from 'react';
import ForgotPassword from '../components/auth/ForgotPassword';
import PageTransition from '../components/common/PageTransition';

const ForgotPasswordPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <ForgotPassword />
      </div>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
