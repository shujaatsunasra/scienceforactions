"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  count?: number;
}

interface FilterDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function FilterDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  searchable = true,
  disabled = false,
  className = ""
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Find selected option
  const selectedOption = options.find(option => option.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleOptionSelect = (option: DropdownOption) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
        </label>
      )}
      
      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full p-3 bg-white border border-grayBorder rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary 
          text-left flex items-center justify-between
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-primary cursor-pointer'}
          ${isOpen ? 'border-primary ring-2 ring-primary' : ''}
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOption?.icon && (
            <span className="text-lg">{selectedOption.icon}</span>
          )}
          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <div>
                <div className="font-medium text-text truncate">
                  {selectedOption.label}
                  {selectedOption.count !== undefined && (
                    <span className="ml-2 text-sm text-grayText">({selectedOption.count})</span>
                  )}
                </div>
                {selectedOption.description && (
                  <div className="text-sm text-grayText truncate">
                    {selectedOption.description}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-grayText">{placeholder}</span>
            )}
          </div>
        </div>
        
        <svg
          className={`w-5 h-5 text-grayText transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute z-50 w-full mt-1 bg-white border border-grayBorder rounded-lg shadow-lg max-h-64 overflow-hidden">
            {searchable && (
              <div className="p-3 border-b border-grayBorder">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className="w-full p-2 text-sm border border-grayBorder rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`
                      w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3
                      ${value === option.id ? 'bg-primary/5 border-r-2 border-primary' : ''}
                      transition-colors
                    `}
                  >
                    {option.icon && (
                      <span className="text-lg flex-shrink-0">{option.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text truncate">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-sm text-grayText ml-2">
                            {option.count}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <div className="text-sm text-grayText truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {value === option.id && (
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-grayText">
                  No options found
                </div>
              )}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

