/**
 * CardGrid Component
 * Dynamic responsive grid layout for memory cards
 * Adapts to different card counts and screen sizes
 */

import React, { memo, useMemo, useCallback } from 'react';
import { Card as CardType } from '@/types';
import { Card } from '@/components/Card/Card';
import { calculateGridDimensions } from '@/game';
import './CardGrid.css';

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CardGridProps {
  cards: CardType[];
  onCardFlip: (cardId: string) => void;
  canFlip: boolean;
  columns?: number;
  visualSimilarity?: number;
  movementEnabled?: boolean;
  animationEnabled?: boolean;
}

// ============================================================================
// CARD GRID COMPONENT
// ============================================================================

export const CardGrid = memo<CardGridProps>(({
  cards,
  onCardFlip,
  canFlip,
  columns,
  visualSimilarity = 0,
  movementEnabled = false,
  animationEnabled = true,
}) => {
  // Calculate optimal grid dimensions
  const gridDimensions = useMemo(() => {
    if (columns) {
      const rows = Math.ceil(cards.length / columns);
      return { columns, rows };
    }
    return calculateGridDimensions(cards.length);
  }, [cards.length, columns]);

  // Determine card size based on grid density
  const cardSize = useMemo((): 'small' | 'medium' | 'large' => {
    const totalCards = cards.length;
    if (totalCards <= 12) return 'large';
    if (totalCards <= 24) return 'medium';
    return 'small';
  }, [cards.length]);

  // Handle card flip with memoization
  const handleCardFlip = useCallback((cardId: string) => {
    onCardFlip(cardId);
  }, [onCardFlip]);

  // Grid style for dynamic columns
  const gridStyle = {
    '--grid-columns': gridDimensions.columns,
    '--grid-rows': gridDimensions.rows,
    '--art-similarity': visualSimilarity.toFixed(2),
  } as React.CSSProperties;

  const gridClasses = [
    'card-grid',
    visualSimilarity > 0.08 ? 'card-grid--high-similarity' : '',
    movementEnabled ? 'card-grid--moving' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={gridClasses}
      style={gridStyle}
      role="grid"
      aria-label={`Memory game grid with ${cards.length} cards`}
    >
      <div className="card-grid__container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="card-grid__cell"
            style={{
              '--cell-index': index,
            } as React.CSSProperties}
            role="gridcell"
          >
            <Card
              card={card}
              onFlip={handleCardFlip}
              canFlip={canFlip}
              size={cardSize}
              animationEnabled={animationEnabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

CardGrid.displayName = 'CardGrid';

export default CardGrid;
