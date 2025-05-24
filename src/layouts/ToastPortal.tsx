'use client'

import { createPortal } from 'react-dom';
import { Toaster as RHTToaster } from 'react-hot-toast';
import { Toaster as SonnerToaster } from 'sonner';
import { FC } from 'react'

type Props = {
  settings: any
}

const ToastPortal: FC<Props> = ({ settings }) => {
  if (typeof document !== 'undefined') {
    let portalRoot = document.getElementById('toast-portal-root');
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = 'toast-portal-root';
      portalRoot.style.position = 'fixed';
      portalRoot.style.zIndex = '9999';
      portalRoot.style.top = '0';
      portalRoot.style.left = '0';
      portalRoot.style.right = '0';
      document.body.appendChild(portalRoot);
    }

    return createPortal(
      <>
        <RHTToaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
        <SonnerToaster richColors closeButton position="top-right" style={{ width: '100%' }} />
      </>,
      portalRoot
    );
  }

  return null;
};

export default ToastPortal;
