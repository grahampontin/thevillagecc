import React from 'react';

export interface NavBarProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export const NavBar: React.FC<NavBarProps> = ({ title, onBack, rightContent }) => (
  <div className="flex items-center px-4 py-3 bg-villageGreen text-white shadow-sm flex-shrink-0">
    {onBack ? (
      <button
        onClick={onBack}
        className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Back"
      >
        <span className="material-symbols-outlined text-xl leading-none">arrow_back</span>
      </button>
    ) : (
      <div className="w-8 mr-3" />
    )}
    <h1 className="flex-1 text-base font-semibold truncate">{title}</h1>
    {rightContent && <div className="ml-2 flex items-center gap-2">{rightContent}</div>}
  </div>
);

export interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => (
  <div className="fixed bottom-4 left-4 right-4 z-50 bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-lg mx-auto">
    <span className="material-symbols-outlined flex-shrink-0">error</span>
    <p className="flex-1 text-sm">{message}</p>
    <button onClick={onClose} aria-label="Close" className="flex-shrink-0 hover:opacity-80">
      <span className="material-symbols-outlined">close</span>
    </button>
  </div>
);

