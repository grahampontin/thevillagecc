import React from 'react';
export interface RunCircleButtonProps {
  value: number;
  label: React.ReactNode;
  onClick: () => void;
  variant: 'outline' | 'fill' | 'fill-blue';
  highlight?: boolean;
  disabled?: boolean;
}
export const RunCircleButton: React.FC<RunCircleButtonProps> = ({
  label, onClick, variant, highlight, disabled,
}) => {
  let baseClass = 'aspect-square rounded-full flex items-center justify-center text-sm font-bold transition-all active:scale-95 shadow-sm ';
  if (disabled) baseClass += 'opacity-40 cursor-not-allowed ';
  if (variant === 'outline') {
    baseClass += highlight
      ? 'border-2 border-villageGreen text-villageGreen bg-villageGreenLight animate-pulse '
      : 'border-2 border-gray-400 text-gray-700 bg-white hover:border-villageGreen hover:text-villageGreen ';
  } else if (variant === 'fill-blue') {
    baseClass += 'bg-blue-600 text-white hover:bg-blue-700 ';
  } else {
    baseClass += 'bg-gray-700 text-white hover:bg-gray-800 ';
  }
  return (
    <button onClick={disabled ? undefined : onClick} className={baseClass} type="button">
      {label}
    </button>
  );
};
export interface ExtrasCircleButtonProps {
  label: string;
  onClick: () => void;
  highlight?: boolean;
}
export const ExtrasCircleButton: React.FC<ExtrasCircleButtonProps> = ({ label, onClick, highlight }) => (
  <button
    onClick={onClick}
    type="button"
    className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-95 shadow-sm ${
      highlight
        ? 'bg-gray-600 text-white animate-pulse'
        : 'bg-gray-500 text-white hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);
