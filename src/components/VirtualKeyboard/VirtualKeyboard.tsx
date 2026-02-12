/**
 * VirtualKeyboard Component
 * On-screen keyboard for tablet name entry
 * Optimized for touch interaction
 */

import React, { memo, useCallback, useState } from 'react';
import { CONSTANTS } from '@/types';
import './VirtualKeyboard.css';

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface VirtualKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  maxLength?: number;
}

// ============================================================================
// KEYBOARD LAYOUT
// ============================================================================

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

// ============================================================================
// VIRTUAL KEYBOARD COMPONENT
// ============================================================================

export const VirtualKeyboard = memo<VirtualKeyboardProps>(({
  value,
  onChange,
  onSubmit,
  maxLength = CONSTANTS.MAX_PLAYER_NAME_LENGTH,
}) => {
  const [isShift, setIsShift] = useState(true);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (value.length < maxLength) {
      const char = isShift ? key.toUpperCase() : key.toLowerCase();
      onChange(value + char);
    }
  }, [value, maxLength, isShift, onChange]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    onChange(value.slice(0, -1));
  }, [value, onChange]);

  // Handle space
  const handleSpace = useCallback(() => {
    if (value.length < maxLength && value.length > 0 && !value.endsWith(' ')) {
      onChange(value + ' ');
    }
  }, [value, maxLength, onChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  // Toggle shift
  const toggleShift = useCallback(() => {
    setIsShift(prev => !prev);
  }, []);

  // Get display value
  const displayValue = value || 'Enter your name...';

  return (
    <div className="virtual-keyboard">
      {/* Display */}
      <div className="virtual-keyboard__display">
        <span className={`virtual-keyboard__value ${!value ? 'virtual-keyboard__value--placeholder' : ''}`}>
          {displayValue}
        </span>
        <span className="virtual-keyboard__counter">
          {value.length}/{maxLength}
        </span>
      </div>

      {/* Keyboard */}
      <div className="virtual-keyboard__keys">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="virtual-keyboard__row">
            {row.map((key) => (
              <button
                key={key}
                className="virtual-keyboard__key"
                onClick={() => handleKeyPress(key)}
                disabled={value.length >= maxLength}
                type="button"
              >
                {isShift ? key.toUpperCase() : key.toLowerCase()}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom row with special keys */}
        <div className="virtual-keyboard__row virtual-keyboard__row--bottom">
          <button
            className={`virtual-keyboard__key virtual-keyboard__key--shift ${isShift ? 'virtual-keyboard__key--active' : ''}`}
            onClick={toggleShift}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l9 9h-6v9H9v-9H3l9-9z" />
            </svg>
          </button>
          
          <button
            className="virtual-keyboard__key virtual-keyboard__key--space"
            onClick={handleSpace}
            disabled={value.length >= maxLength}
            type="button"
          >
            SPACE
          </button>
          
          <button
            className="virtual-keyboard__key virtual-keyboard__key--backspace"
            onClick={handleBackspace}
            disabled={value.length === 0}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
              <path d="M15 8l-6 6M9 8l6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="virtual-keyboard__actions">
        <button
          className="virtual-keyboard__btn virtual-keyboard__btn--secondary"
          onClick={handleClear}
          disabled={value.length === 0}
          type="button"
        >
          Clear
        </button>
        <button
          className="virtual-keyboard__btn virtual-keyboard__btn--primary"
          onClick={onSubmit}
          disabled={value.length < CONSTANTS.MIN_PLAYER_NAME_LENGTH}
          type="button"
        >
          Submit Score
        </button>
      </div>
    </div>
  );
});

VirtualKeyboard.displayName = 'VirtualKeyboard';

export default VirtualKeyboard;
