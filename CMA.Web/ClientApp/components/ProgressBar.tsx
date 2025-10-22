import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress percentage (0-100)
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '', size = 'md' }) => {
  // Determine height based on size
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size];
  
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`bg-gray-700 rounded-full ${heightClass} ${className} overflow-hidden`}>
      <div 
        className="bg-primary rounded-full transition-all duration-500 ease-out relative"
        style={{ 
          width: `${clampedProgress}%`,
          height: '100%'
        }}
      >
        {clampedProgress > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary animate-pulse-slow"></div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;