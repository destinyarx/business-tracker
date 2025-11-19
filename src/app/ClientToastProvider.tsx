'use client';

import React from 'react';
import { ToastProvider } from '@/hooks/useNotification';

const ClientToastProvider: React.FC = () => {
  return <ToastProvider />;
};

export default ClientToastProvider;