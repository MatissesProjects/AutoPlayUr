(() => {
    const VERSION = "1.1.0";
    console.info(`AutoPlayUr v${VERSION} content script (TS) loaded.`);

    enum UrRule {
        FINKEL = 'finkel',
        MASTERS = 'masters',
        BLITZ = 'blitz',
        CUSTOM = 'custom'
    }

    enum UrBot {
        EASY = 'easy',
        MEDIUM = 'medium',
        HARD = 'hard',
        PANDA = 'panda'
    }

    interface AppSettings {
        rules: UrRule;
        bot: UrBot;
    }

    const ACTION_COOLDOWN_MS = 600;
    const POLL_INTERVAL_MS = 200;
    
    let lastActionTime = 0;

    const UI_CONSTANTS = {
        PANEL_ID: 'autoplayur-panel',
        RULE_SELECT_ID: 'ur-rule-select',
        BOT_SELECT_ID: 'ur-bot-select',
        START_BTN_ID: 'ur-new-game'
    };

    /**
     * Injects the control panel into the page
     */
    function injectUI(): void {
        if (document.getElementById(UI_CONSTANTS.PANEL_ID)) return;
        
        const panel = document.createElement('div');
        panel.id = UI_CONSTANTS.PANEL_ID;
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(20,20,20,0.95)',
            color: '#eee',
            padding: '12px',
            borderRadius: '8px',
            zIndex: '999999',
            fontFamily: 'sans-serif',
            fontSize: '13px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            border: '1px solid #444'
        });
        
        panel.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 4px;">AutoPlayUr</div>
            <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                <label style="margin-right: 8px;">Rules:</label>
                <select id="${UI_CONSTANTS.RULE_SELECT_ID}" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px;">
                    ${Object.values(UrRule).map(r => `<option value="${r}">${r.charAt(0).toUpperCase() + r.slice(1)}</option>`).join('')}
                </select>
            </div>
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <label style="margin-right: 8px;">Bot:</label>
                <select id="${UI_CONSTANTS.BOT_SELECT_ID}" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px;">
                    ${Object.values(UrBot).map(b => `<option value="${b}">${b.charAt(0).toUpperCase() + b.slice(1)}</option>`).join('')}
                </select>
            </div>
            <button id="${UI_CONSTANTS.START_BTN_ID}" style="width: 100%; background: #2c6bed; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">Start Game</button>
        `;
        document.body.appendChild(panel);
        
        const ruleSelect = document.getElementById(UI_CONSTANTS.RULE_SELECT_ID) as HTMLSelectElement;
        const botSelect = document.getElementById(UI_CONSTANTS.BOT_SELECT_ID) as HTMLSelectElement;
        const startBtn = document.getElementById(UI_CONSTANTS.START_BTN_ID) as HTMLButtonElement;

        // Load saved settings or defaults
        chrome.storage.local.get(['rules', 'bot'], (result) => {
            const urlParams = new URLSearchParams(window.location.search);
            const currentRule = (urlParams.get('rules') as UrRule) || result.rules || UrRule.FINKEL;
            const currentBot = (urlParams.get('bot') as UrBot) || result.bot || UrBot.HARD;
            
            ruleSelect.value = currentRule;
            botSelect.value = currentBot;

            // Sync with storage if we used URL params or defaults
            if (currentRule !== result.rules || currentBot !== result.bot) {
                chrome.storage.local.set({ rules: currentRule, bot: currentBot });
            }
        });

        // Save on manual change
        ruleSelect.addEventListener('change', () => {
            chrome.storage.local.set({ rules: ruleSelect.value });
        });
        botSelect.addEventListener('change', () => {
            chrome.storage.local.set({ bot: botSelect.value });
        });
        
        startBtn.addEventListener('click', () => {
            const rule = ruleSelect.value;
            const bot = botSelect.value;
            window.location.href = `https://royalur.net/game?tab=play&mode=computer&rules=${rule}&bot=${bot}`;
        });
    }

    /**
     * Checks for and executes automated game actions
     */
    function performAutoActions(): void {
        injectUI();

        const now = Date.now();
        if (now - lastActionTime < ACTION_COOLDOWN_MS) return;

        let acted = false;

        // 1. Auto Roll Dice
        const rollableDice = document.querySelector<HTMLElement>('[class*="DiceUI_dice_container"][class*="DiceUI_can_be_rolled"]');
        if (rollableDice) {
            console.log("AutoPlayUr: Rolling dice...");
            rollableDice.click();
            acted = true;
        }

        // 2. Auto Play if only 1 move
        if (!acted) {
            // Find all playable elements that are not dice
            const allPlayable = document.querySelectorAll<HTMLElement>('[class*="can_be_"]:not([class*="DiceUI"])');
            if (allPlayable.length === 1) {
                console.log("AutoPlayUr: Only 1 playable piece found, clicking it...");
                allPlayable[0].click();
                acted = true;
            } else if (allPlayable.length === 0) {
                // Fallback heuristic for different UI versions/classes
                const playablePieces = document.querySelectorAll<HTMLElement>('[class*="PieceUI_"][class*="playable"], [class*="Piece_"][class*="playable_"]');
                if (playablePieces.length === 1) {
                    console.log("AutoPlayUr: Only 1 playable piece found (fallback), clicking it...");
                    playablePieces[0].click();
                    acted = true;
                }
            }
        }

        if (acted) {
            lastActionTime = now;
        }
    }

    // Main Loop
    setInterval(performAutoActions, POLL_INTERVAL_MS);
})();