'use client';

import React from 'react';
import { toast, ToastContainer, Slide, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotifyOptions {
  message: string;
  title?: string;
  duration?: number;
}

interface ToastSystem {
  success: (options: NotifyOptions) => void;
  error: (options: NotifyOptions) => void;
  info: (options: NotifyOptions) => void;
  loading: <T>(promise: Promise<T>, message?: string) => Id;
}

export const ToastProvider: React.FC = () => (
  <ToastContainer
    position="top-right"
    hideProgressBar={true}
    newestOnTop={true}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    transition={Slide}
  />
);

export const useNotify = (): ToastSystem => {
  const toastStyles: Record<string, string> = {
    success: 'bg-green-50 border-l-4 border-green-500',
    error: 'bg-red-50 border-l-4 border-red-500',
    info: 'bg-blue-50 border-l-4 border-blue-500',
    loading: 'bg-gray-50 border-l-4 border-gray-300'
  };

  const success = ({ message, title = 'Success', duration = 3000 }: NotifyOptions) => {
    toast.success(
      <div className="flex items-center space-x-2 p-3">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      </div>,
      { className: toastStyles.success, autoClose: duration, transition: Slide }
    );
  };

  const error = ({ message, title = 'Error', duration = 4000 }: NotifyOptions) => {
    toast.error(
      <div className="flex items-center space-x-2 p-3">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      </div>,
      { className: toastStyles.error, autoClose: duration, transition: Slide }
    );
  };

  const info = ({ message, title = 'Info', duration = 3000 }: NotifyOptions) => {
    toast.info(
      <div className="flex items-center space-x-2 p-3">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      </div>,
      { className: toastStyles.info, autoClose: duration, transition: Slide }
    );
  };

  const loading = <T,>(promise: Promise<T>, message: string = 'Loading...'): Id => {
    // Cast the promise parameter to unknown first, as TypeScript recommends
    const safePromise = promise as unknown as Promise<unknown>;
  
    // toast.promise returns Id, not Promise
    const toastId = toast.promise(safePromise, {
      pending: {
        render: (
          <div className="flex items-center space-x-2 p-3">
            <span>{message}</span>
          </div>
        ),
        className: 'bg-gray-50 border-l-4 border-gray-300',
        autoClose: false,
      },
      success: {
        render: (
          <div className="flex items-center space-x-2 p-3">
            <span>Success</span>
          </div>
        ),
        className: 'bg-green-50 border-l-4 border-green-500',
        autoClose: 3000,
      },
      error: {
        render: (
          <div className="flex items-center space-x-2 p-3">
            <span>Error</span>
          </div>
        ),
        className: 'bg-red-50 border-l-4 border-red-500',
        autoClose: 4000,
      },
    });
  
    return toastId as unknown as Id; // ✅ cast the return, not the promise
  };

  return { success, error, info, loading };
};
