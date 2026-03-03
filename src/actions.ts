import { ACTION_COOLDOWN_MS } from './constants';

let lastActionTime = 0;
let lastActionType: 'roll' | 'move' | null = null;
let lastTargetElement: HTMLElement | null = null;

export const Automation = {
  /**
   * Main automation entry point
   */
  async run(): Promise<void> {
    const now = Date.now();
    // Use a slightly longer cooldown for the same action type to avoid double-clicks
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

    // Only click if it's a "new" rollable state or enough time has passed
    if (rollableDice) {
      if (lastActionType === 'roll' && lastTargetElement === rollableDice) {
        // We already clicked this exact dice container recently
        return false;
      }

      console.log('AutoPlayUr: Rolling dice...');
      this.highlightElement(rollableDice);
      rollableDice.click();
      
      lastActionType = 'roll';
      lastTargetElement = rollableDice;
      return true;
    }
    return false;
  },

  trySingleMove(): boolean {
    const allPlayable = document.querySelectorAll<HTMLElement>(
      'button[class*="can_be_"]:not([class*="Dice"]), button[class*="playable"]:not([class*="Dice"]), button[class*="movable"]:not([class*="Dice"]), div[class*="can_be_"]:not([class*="Dice"]):not([class*="Panel"]):not([class*="Header"]), div[class*="Piece"][class*="playable"], div[class*="Piece"][class*="movable"]',
    );

    if (allPlayable.length === 0) return false;

    // Deduplicate logic
    const uniqueElements = Array.from(allPlayable).filter((el, index, self) => 
      index === self.findIndex((t) => (
        t.innerText === el.innerText && 
        t.className === el.className &&
        t.getAttribute('data-tile') === el.getAttribute('data-tile') &&
        t.getAttribute('aria-label') === el.getAttribute('aria-label')
      ))
    );

    if (uniqueElements.length === 1) {
      const target = uniqueElements[0];

      // Avoid clicking the same piece twice for the same move
      if (lastActionType === 'move' && lastTargetElement === target) {
        return false;
      }

      console.log('AutoPlayUr: Only 1 unique playable piece found, clicking it...');
      this.highlightElement(target);
      target.click();

      lastActionType = 'move';
      lastTargetElement = target;
      return true;
    }

    if (uniqueElements.length > 1) {
      console.debug(`AutoPlayUr: ${uniqueElements.length} unique playable pieces found. Waiting for manual move.`);
    }

    return false;
  },
};
