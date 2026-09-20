'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuthModal } from './AuthModal';

export const AuthModalWrapper: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useApp();
  return <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />;
};
