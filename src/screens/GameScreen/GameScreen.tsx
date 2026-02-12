/**
 * GameScreen Component
 * Main gameplay screen with card grid and HUD
 */

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useGameStore, selectCurrentLevelConfig } from '@/store';
import { CardGrid, HUD } from '@/components';
import { CONSTANTS } from '@/types';
import './GameScreen.css';

export const GameScreen = memo(() => {
  const {
    cards,
    currentLevel,
    gameStatus,
    score,
    comboMultiplier,
    elapsedTime,
    previewTimeRemaining,
    matchCount,
    moveCount,
    matchedCards,
    isInteractionLocked,
    lastMatchId,
    matchEffectNonce,
    showComboAnimation,
    flipCard,
    tick,
    goToNextLevel,
    restartLevel,
    resetGame,
    navigateToScreen,
  } = useGameStore();

  const levelConfig = selectCurrentLevelConfig(useGameStore.getState());
  const totalCards = levelConfig?.totalCards || cards.length;

  const lastTickRef = useRef(Date.now());
  const boardRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef(gameStatus);

  const [matchBeam, setMatchBeam] = useState<null | {
    x: number;
    y: number;
    width: number;
    angle: number;
  }>(null);
  const [showMatchBurst, setShowMatchBurst] = useState(false);
  const [showPreviewOutro, setShowPreviewOutro] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (gameStatus !== 'playing' && gameStatus !== 'preview') {
      return;
    }

    // Reset tick baseline whenever a new active phase starts.
    // Without this, re-entering preview after a completed round can consume the
    // entire preview duration in one large delta.
    lastTickRef.current = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      lastTickRef.current = now;
      tick(deltaMs);
    };

    const intervalId = setInterval(gameLoop, 100);
    return () => clearInterval(intervalId);
  }, [gameStatus, tick]);

  useEffect(() => {
    if (prevStatusRef.current === 'preview' && gameStatus === 'playing') {
      setShowPreviewOutro(true);
      const timeout = window.setTimeout(() => setShowPreviewOutro(false), 380);
      prevStatusRef.current = gameStatus;
      return () => clearTimeout(timeout);
    }

    prevStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    if (!matchEffectNonce || !lastMatchId || !boardRef.current) {
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();
    const matchedPair = Array.from(
      boardRef.current.querySelectorAll<HTMLElement>(`[data-pair-id="${lastMatchId}"]`)
    );
    if (matchedPair.length < 2) {
      return;
    }

    const first = matchedPair[0].getBoundingClientRect();
    const second = matchedPair[1].getBoundingClientRect();
    const x1 = first.left + first.width / 2 - boardRect.left;
    const y1 = first.top + first.height / 2 - boardRect.top;
    const x2 = second.left + second.width / 2 - boardRect.left;
    const y2 = second.top + second.height / 2 - boardRect.top;
    const dx = x2 - x1;
    const dy = y2 - y1;

    setMatchBeam({
      x: x1,
      y: y1,
      width: Math.hypot(dx, dy),
      angle: Math.atan2(dy, dx) * (180 / Math.PI),
    });
    setShowMatchBurst(true);

    const beamTimeout = window.setTimeout(() => setMatchBeam(null), 260);
    const burstTimeout = window.setTimeout(() => setShowMatchBurst(false), 420);

    return () => {
      clearTimeout(beamTimeout);
      clearTimeout(burstTimeout);
    };
  }, [matchEffectNonce, lastMatchId]);

  const accuracy = useMemo(() => {
    if (moveCount === 0) return 100;
    return Math.round((matchCount / moveCount) * 100);
  }, [matchCount, moveCount]);

  const levelStars = useMemo(() => {
    if (accuracy >= 90) return 3;
    if (accuracy >= 75) return 2;
    return 1;
  }, [accuracy]);

  const previewSeconds = Math.max(1, Math.ceil(previewTimeRemaining / 1000));

  const handleCardFlip = useCallback((cardId: string) => {
    flipCard(cardId);
  }, [flipCard]);

  const handlePause = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleNextLevel = useCallback(() => {
    goToNextLevel();
  }, [goToNextLevel]);

  const handleReturnToMenu = useCallback(() => {
    setIsMenuOpen(false);
    resetGame();
    navigateToScreen('start');
  }, [navigateToScreen, resetGame]);

  const handleResume = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleRestartLevel = useCallback(() => {
    setIsMenuOpen(false);
    restartLevel();
  }, [restartLevel]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  return (
    <div className="game-screen">
      <div className="game-screen__bg" aria-hidden="true">
        <div className="game-screen__gradient" />
        <div className="game-screen__grid-pattern" />
        <div className="game-screen__stars" />
      </div>

      <div className="game-screen__content">
        <div className="game-screen__hud">
          <HUD
            score={score}
            currentLevel={currentLevel}
            gameStatus={gameStatus}
            elapsedTime={elapsedTime}
            previewTimeRemaining={previewTimeRemaining}
            comboMultiplier={comboMultiplier}
            matchCount={matchCount}
            moveCount={moveCount}
            matchedCards={matchedCards.length}
            totalCards={totalCards}
            showComboAnimation={showComboAnimation}
            timeLimitSeconds={levelConfig?.timeLimit ?? null}
          />
        </div>

        <div className="game-screen__game-area" ref={boardRef}>
          <button
            className="game-screen__pause-btn"
            onClick={handlePause}
            aria-label="Open game menu"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="7" x2="19" y2="7" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="5" y1="17" x2="19" y2="17" />
            </svg>
          </button>

          {isMenuOpen && (
            <>
              <button
                className="game-screen__menu-backdrop"
                onClick={handleResume}
                aria-label="Close menu"
              />
              <div className="game-screen__menu" role="menu" aria-label="Game menu">
                <button className="game-screen__menu-item" role="menuitem" onClick={handleResume}>
                  Resume
                </button>
                <button className="game-screen__menu-item" role="menuitem" onClick={handleRestartLevel}>
                  Restart Level
                </button>
                <button className="game-screen__menu-item game-screen__menu-item--danger" role="menuitem" onClick={handleReturnToMenu}>
                  Main Menu
                </button>
              </div>
            </>
          )}

          {(gameStatus === 'preview' || showPreviewOutro) && (
            <div
              className={`game-screen__preview-overlay ${
                showPreviewOutro && gameStatus !== 'preview'
                  ? 'game-screen__preview-overlay--outro'
                  : ''
              }`}
              aria-live="polite"
            >
              <div className="game-screen__preview-title">MEMORIZE THE CARDS</div>
              {gameStatus === 'preview' ? (
                <div className="game-screen__preview-countdown">Starting in {previewSeconds}</div>
              ) : (
                <div className="game-screen__preview-countdown">Go!</div>
              )}
            </div>
          )}

          {matchBeam && (
            <div
              className="game-screen__match-beam"
              style={{
                left: `${matchBeam.x}px`,
                top: `${matchBeam.y}px`,
                width: `${matchBeam.width}px`,
                transform: `rotate(${matchBeam.angle}deg)`,
              }}
              aria-hidden="true"
            />
          )}

          {showMatchBurst && (
            <div className="game-screen__match-burst" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className="game-screen__match-particle"
                  style={{
                    '--particle-angle': `${index * 22.5}deg`,
                    '--particle-delay': `${(index % 4) * 20}ms`,
                  } as CSSProperties}
                />
              ))}
            </div>
          )}

          <CardGrid
            cards={cards}
            onCardFlip={handleCardFlip}
            canFlip={!isInteractionLocked && gameStatus === 'playing'}
            columns={levelConfig?.gridColumns}
            animationEnabled={true}
          />
        </div>

        {showComboAnimation && comboMultiplier > 1 && (
          <div className="game-screen__combo-overlay" aria-live="polite">
            <span className="game-screen__combo-overlay-value">{comboMultiplier.toFixed(1)}x</span>
            <span className="game-screen__combo-overlay-label">COMBO!</span>
          </div>
        )}

        {gameStatus === 'levelComplete' && (
          <div className="game-screen__level-modal" role="dialog" aria-modal="true" aria-label="Level complete">
            <div className="game-screen__level-modal-card">
              <div className="game-screen__level-modal-title">LEVEL COMPLETE</div>
              <div className="game-screen__level-modal-stars" aria-label={`${levelStars} star rating`}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <span
                    key={index}
                    className={`game-screen__star ${index < levelStars ? 'game-screen__star--active' : ''}`}
                  >
                    {'\u2605'}
                  </span>
                ))}
              </div>
              <div className="game-screen__level-modal-score">{score.toLocaleString()}</div>
              <div className="game-screen__level-modal-meta">
                <span>Accuracy {accuracy}%</span>
                <span>Moves {moveCount}</span>
                <span>Matches {matchCount}</span>
              </div>
              <div className="game-screen__level-modal-actions">
                <button className="game-screen__btn game-screen__btn--primary" onClick={handleNextLevel}>
                  {currentLevel >= CONSTANTS.MAX_LEVEL ? 'View Results' : 'Next Level'}
                </button>
                <button className="game-screen__btn game-screen__btn--ghost" onClick={handleReturnToMenu}>
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

GameScreen.displayName = 'GameScreen';

export default GameScreen;
