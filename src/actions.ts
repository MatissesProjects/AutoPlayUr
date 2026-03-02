import { ACTION_COOLDOWN_MS } from './constants';

let lastActionTime = 0;

export const Automation = {
  /**
   * Main automation entry point
   */
  async run() {
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

  tryRollDice(): boolean {
    const rollableDice = document.querySelector<HTMLElement>(
      '[class*="DiceUI_dice_container"][class*="DiceUI_can_be_rolled"]',
    );
    if (rollableDice) {
      console.log('AutoPlayUr: Rolling dice...');
      rollableDice.click();
      return true;
    }
    return false;
  },

  trySingleMove(): boolean {
    const allPlayable = document.querySelectorAll<HTMLElement>(
      '[class*="can_be_"]:not([class*="DiceUI"])',
    );

    if (allPlayable.length === 1) {
      console.log('AutoPlayUr: Only 1 playable piece found, clicking it...');
      allPlayable[0].click();
      return true;
    }

    // Fallback heuristic for different UI versions
    if (allPlayable.length === 0) {
      const playablePieces = document.querySelectorAll<HTMLElement>(
        '[class*="PieceUI_"][class*="playable"], [class*="Piece_"][class*="playable_"]',
      );
      if (playablePieces.length === 1) {
        console.log('AutoPlayUr: Only 1 playable piece found (fallback), clicking it...');
        playablePieces[0].click();
        return true;
      }
    }

    return false;
  },
};
