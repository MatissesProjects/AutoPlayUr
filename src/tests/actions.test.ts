import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Automation } from '../actions';

describe('Automation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should roll dice when available', () => {
    // Setup: Create a rollable dice element
    const dice = document.createElement('div');
    dice.className = 'DiceUI_dice_container DiceUI_can_be_rolled';
    const clickSpy = vi.fn();
    dice.addEventListener('click', clickSpy);
    document.body.appendChild(dice);

    const acted = Automation.tryRollDice();
    expect(acted).toBe(true);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should click piece when only one move is available', () => {
    // Setup: Create exactly one playable piece
    const piece = document.createElement('div');
    piece.className = 'PieceUI_can_be_played';
    const clickSpy = vi.fn();
    piece.addEventListener('click', clickSpy);
    document.body.appendChild(piece);

    const acted = Automation.trySingleMove();
    expect(acted).toBe(true);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should NOT click when multiple moves are available', () => {
    // Setup: Create two playable pieces
    const p1 = document.createElement('div');
    p1.className = 'PieceUI_can_be_played';
    const p2 = document.createElement('div');
    p2.className = 'PieceUI_can_be_played';
    
    document.body.appendChild(p1);
    document.body.appendChild(p2);

    const acted = Automation.trySingleMove();
    expect(acted).toBe(false);
  });

  it('should use fallback heuristic if primary selector fails', () => {
    // Setup: Create a piece with fallback class name
    const piece = document.createElement('div');
    piece.className = 'PieceUI_playable';
    const clickSpy = vi.fn();
    piece.addEventListener('click', clickSpy);
    document.body.appendChild(piece);

    const acted = Automation.trySingleMove();
    expect(acted).toBe(true);
    expect(clickSpy).toHaveBeenCalled();
  });
});
