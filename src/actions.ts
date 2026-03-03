import { ACTION_COOLDOWN_MS } from './constants';

let lastActionTime = 0;

export const Automation = {
  /**
   * Main automation entry point
   */
  async run(): Promise<void> {
    const now = Date.now();
    if (now - lastActionTime < ACTION_COOLDOWN_MS) return;

    const acted = await this.tryAutoActions();
    if (acted) {
      lastActionTime = now;
    }
  },

  async tryAutoActions(): Promise<boolean> {
    // 1. Auto Roll Dice
    if (this.tryRollDice()) return true;

    // 2. Auto Play if only 1 move
    if (this.trySingleMove()) return true;

    return false;
  },

  /**
   * Briefly highlights an element to show the user what was clicked
   */
  highlightElement(el: HTMLElement): void {
    const originalTransition = el.style.transition;
    const originalBoxShadow = el.style.boxShadow;

    el.style.transition = 'box-shadow 0.3s ease-out';
    el.style.boxShadow = '0 0 20px 5px #2c6bed';

    setTimeout(() => {
      el.style.boxShadow = originalBoxShadow;
      setTimeout(() => {
        el.style.transition = originalTransition;
      }, 300);
    }, 400);
  },

  tryRollDice(): boolean {
    const rollableDice = document.querySelector<HTMLElement>(
      '[class*="Dice"][class*="can_be_rolled"], [class*="Dice"][class*="rollable"]',
    );
    if (rollableDice) {
      console.log('AutoPlayUr: Rolling dice...');
      this.highlightElement(rollableDice);
      rollableDice.click();
      return true;
    }
    return false;
  },

  trySingleMove(): boolean {
    const allPlayable = document.querySelectorAll<HTMLElement>(
      'button[class*="can_be_"]:not([class*="Dice"]), button[class*="playable"]:not([class*="Dice"]), button[class*="movable"]:not([class*="Dice"]), div[class*="can_be_"]:not([class*="Dice"]):not([class*="Panel"]):not([class*="Header"]), div[class*="Piece"][class*="playable"], div[class*="Piece"][class*="movable"]',
    );

    if (allPlayable.length === 1) {
      console.log('AutoPlayUr: Only 1 playable piece found, clicking it...');
      this.highlightElement(allPlayable[0]);
      allPlayable[0].click();
      return true;
    }

    if (allPlayable.length > 1) {
      // Filter out duplicates if any (same position/id)
      const uniqueElements = Array.from(allPlayable).filter((el, index, self) => 
        index === self.findIndex((t) => (
          t.innerText === el.innerText && 
          t.className === el.className &&
          t.getAttribute('data-tile') === el.getAttribute('data-tile') &&
          t.getAttribute('aria-label') === el.getAttribute('aria-label')
        ))
      );
      
      if (uniqueElements.length === 1) {
        console.log('AutoPlayUr: Only 1 unique playable piece found, clicking it...');
        this.highlightElement(uniqueElements[0]);
        uniqueElements[0].click();
        return true;
      }
      
      console.debug(`AutoPlayUr: ${allPlayable.length} playable pieces found (${uniqueElements.length} unique). Waiting for manual move.`);
    }

    // Fallback heuristic for different UI versions
    if (allPlayable.length === 0) {
      const playablePieces = document.querySelectorAll<HTMLElement>(
        'button[class*="PieceUI_"][class*="playable"], button[class*="Piece_"][class*="playable_"], button[class*="Piece_"][class*="movable"]',
      );
      if (playablePieces.length === 1) {
        console.log('AutoPlayUr: Only 1 playable piece found (fallback), clicking it...');
        this.highlightElement(playablePieces[0]);
        playablePieces[0].click();
        return true;
      }
    }

    return false;
  },
};
