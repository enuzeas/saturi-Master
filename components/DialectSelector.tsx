import React from 'react';
import { DIALECT_OPTIONS } from '../constants';
import { DialectRegion } from '../types';

interface DialectSelectorProps {
  selected: DialectRegion;
  onSelect: (dialect: DialectRegion) => void;
  disabled?: boolean;
}

const DialectSelector: React.FC<DialectSelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {DIALECT_OPTIONS.map((option) => {
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl text-left transition-all duration-200 border
              flex flex-col h-full gap-2
              ${isSelected 
                ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-md transform -translate-y-1' 
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              w-8 h-1 rounded-full 
              ${option.color}
            `} />
            <h3 className={`font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
              {option.label}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {option.description}
            </p>
            
            {isSelected && (
              <div className="absolute top-3 right-3 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DialectSelector;
