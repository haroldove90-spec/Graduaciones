import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'gold';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  variant = 'dark',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  };

  const textSizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative shrink-0 ${sizeMap[size]}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle shield / badge base */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            className={
              variant === 'light'
                ? 'fill-white/10 stroke-amber-400/40'
                : 'fill-slate-900 stroke-amber-500/30'
            }
            strokeWidth="2"
          />

          {/* Laurels left and right */}
          <path
            d="M24 72C18 62 18 42 30 30C33 27 37 25 42 24"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 3"
          />
          <path
            d="M76 72C82 62 82 42 70 30C67 27 63 25 58 24"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 3"
          />

          {/* Mortarboard Rhombus Top */}
          <polygon
            points="50,26 82,39 50,52 18,39"
            fill="url(#logoGoldGrad)"
          />
          <polygon
            points="50,29 76,39 50,49 24,39"
            fill={variant === 'light' ? '#0B1528' : '#0F2042'}
          />

          {/* Cap Base */}
          <path
            d="M32 46V54C32 62 40 67 50 67C60 67 68 62 68 54V46C62 50 56 52 50 52C44 52 38 50 32 46Z"
            fill="url(#logoGoldGrad)"
          />

          {/* Golden Tassel */}
          <circle cx="50" cy="39" r="2.5" fill="#FEF08A" />
          <path
            d="M50 39C65 42 72 50 72 60V68"
            stroke="#FDE047"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <polygon points="70,68 74,68 75,76 69,76" fill="#F59E0B" />

          {/* Mini Diploma scroll */}
          <rect
            x="36"
            y="74"
            width="28"
            height="7"
            rx="2.5"
            fill="#FEF3C7"
            stroke="#F59E0B"
            strokeWidth="1"
          />
          <rect x="47" y="73.5" width="6" height="8" rx="1" fill="#D97706" />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="logoGoldGrad" x1="18" y1="26" x2="82" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span
            className={`font-extrabold tracking-tight whitespace-nowrap ${textSizeMap[size]} ${
              variant === 'light' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Graduaciones
          </span>
          <span
            className={`text-[10px] uppercase font-bold tracking-widest ${
              variant === 'light' ? 'text-amber-300' : 'text-amber-700'
            }`}
          >
            Gestión & Finanzas
          </span>
        </div>
      )}
    </div>
  );
};
