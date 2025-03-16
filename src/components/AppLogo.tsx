
import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  showText?: boolean;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ showText = true, className }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="text-brand-blue w-8 h-8 flex items-center justify-center">
        <ShoppingBasket size={24} />
      </div>
      {showText && (
        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-blue-600">
          ShopList
        </span>
      )}
    </div>
  );
};

export default AppLogo;
