import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress percentage (0-100)
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  // For common percentages, we could use Tailwind classes
  // But for dynamic values, we still need inline styles
  return (
    <div className={`w-32 bg-gray-700 rounded-full h-2 ${className}`}>
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;