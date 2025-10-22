import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Determine tooltip position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  // Determine arrow position classes
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t border-l border-gray-700 bg-gray-900 rotate-45',
    right: 'left-0 top-1/2 transform -translate-y-1/2 border-t border-l border-gray-700 bg-gray-900 rotate-45',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-t border-l border-gray-700 bg-gray-900 rotate-45',
    left: 'right-0 top-1/2 transform -translate-y-1/2 border-t border-l border-gray-700 bg-gray-900 rotate-45'
  };

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute z-50 w-64 p-3 bg-gray-900/90 backdrop-blur-lg text-white text-sm rounded-lg border border-white/20 shadow-glass ${positionClasses[position]} animate-fade-in`}
          role="tooltip"
        >
          <div className="relative">
            {text}
            <div className={`absolute w-3 h-3 ${arrowClasses[position]}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;