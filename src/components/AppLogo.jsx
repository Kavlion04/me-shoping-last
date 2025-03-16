
import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AppLogo component
 * Displays the application logo with optional text
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.showText=true] - Whether to show the text next to the icon
 * @param {string} [props.className] - Additional CSS classes to apply
 */
const AppLogo = ({ showText = true, className }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo icon */}
      <div className="text-brand-blue w-8 h-8 flex items-center justify-center">
        <ShoppingBasket size={24} />
      </div>
      
      {/* Logo text (optional) */}
      {showText && (
        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-blue-600">
          ShopList
        </span>
      )}
    </div>
  );
};

export default AppLogo;
