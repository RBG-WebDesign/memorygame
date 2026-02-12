/**
 * Card Component
 * 3D flip animation card with GPU-accelerated transforms
 * Optimized for 60 FPS on tablet devices
 */

import React, { memo, useCallback, useRef, useEffect } from 'react';
import { Card as CardType } from '@/types';
import { getCardArt } from '@/assets/cardCatalog';
import './Card.css';

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CardProps {
  card: CardType;
  onFlip: (cardId: string) => void;
  canFlip: boolean;
  size: 'small' | 'medium' | 'large';
  animationEnabled: boolean;
}

// ============================================================================
// CARD COMPONENT
// ============================================================================

export const Card = memo<CardProps>(({
  card,
  onFlip,
  canFlip,
  size = 'medium',
  animationEnabled = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFlippingRef = useRef(false);

  // Determine card state classes
  const isFlipped = card.isFlipped || card.isMatched;
  const isMatched = card.isMatched;
  const isClickable = canFlip && !card.isFlipped && !card.isMatched && !card.isLocked;

  // Handle card click/tap
  const handleClick = useCallback(() => {
    if (!isClickable || isFlippingRef.current) return;
    
    // Prevent rapid clicking
    isFlippingRef.current = true;
    
    onFlip(card.id);
    
    // Reset flip lock after animation
    setTimeout(() => {
      isFlippingRef.current = false;
    }, 350);
  }, [card.id, isClickable, onFlip]);

  // Handle touch events for better mobile response
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isClickable) return;
    e.preventDefault();
    handleClick();
  }, [isClickable, handleClick]);

  // Vibration feedback on match (if enabled)
  useEffect(() => {
    if (isMatched && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [isMatched]);

  // Size class mapping
  const sizeClass = `card--${size}`;
  const cardArt = getCardArt(card.emoji);
  
  // State classes
  const stateClasses = [
    isFlipped && 'card--flipped',
    isMatched && 'card--matched',
    !isClickable && 'card--disabled',
    animationEnabled && 'card--animated',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={cardRef}
      className={`card ${sizeClass} ${stateClasses}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      role="button"
      aria-label={`Card ${isFlipped ? cardArt.label : 'hidden'}`}
      aria-pressed={isFlipped}
      tabIndex={isClickable ? 0 : -1}
      data-card-id={card.id}
      data-pair-id={card.pairId}
    >
      <div className="card__inner">
        {/* Card Front (Hidden state - shows pattern) */}
        <div className="card__face card__face--front">
          <div className="card__pattern">
            <div className="card__logo">
              <svg viewBox="0 0 100 100" className="card__logo-svg">
                <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(-30 50 50)"/>
                <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(30 50 50)"/>
                <ellipse cx="50" cy="50" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="3"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Card Back (Revealed state - shows themed art) */}
        <div className="card__face card__face--back">
          <div className="card__content">
            <img
              className="card__art"
              src={cardArt.src}
              alt={cardArt.label}
              draggable={false}
            />
          </div>
          {/* Match glow effect */}
          {isMatched && (
            <>
              <div className="card__glow" aria-hidden="true" />
              <div className="card__confetti" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span
                    key={index}
                    className="card__confetti-piece"
                    style={{
                      '--confetti-angle': `${index * 45}deg`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
