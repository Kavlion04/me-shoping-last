
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Avatar component
 * Displays a colorful circle with the first letter of the user's name
 * 
 * @param {Object} props
 * @param {string} props.name - The name to display the first letter of
 * @param {string} [props.size='md'] - Size of the avatar (sm, md, lg, xl)
 * @param {string} [props.className] - Additional CSS classes
 */
const Avatar = ({ name, size = 'md', className }) => {
  // Generate a color based on the name
  const colors = [
    'bg-brand-red',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-teal-500',
  ];
  
  const colorIndex = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  const bgColor = colors[colorIndex];
  
  // Get the first letter of the name
  const firstLetter = name.charAt(0).toUpperCase();
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
  };
  
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-bold text-white',
      bgColor,
      sizeClasses[size],
      className
    )}>
      {firstLetter}
    </div>
  );
};

export default Avatar;
