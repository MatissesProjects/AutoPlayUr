(function() {
    const VERSION = "1.0.4";
    console.info(`AutoPlayUr v${VERSION} content script loaded.`);

    let lastActionTime = 0;
    const ACTION_COOLDOWN = 600;

    function injectUI() {
        if (document.getElementById('autoplayur-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'autoplayur-panel';
        panel.style.position = 'fixed';
        panel.style.bottom = '10px';
        panel.style.left = '10px';
        panel.style.backgroundColor = 'rgba(20,20,20,0.95)';
        panel.style.color = '#eee';
        panel.style.padding = '12px';
        panel.style.borderRadius = '8px';
        panel.style.zIndex = '999999';
        panel.style.fontFamily = 'sans-serif';
        panel.style.fontSize = '13px';
        panel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        panel.style.border = '1px solid #444';
        
        panel.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 4px;">AutoPlayUr</div>
            <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                <label style="margin-right: 8px;">Rules:</label>
                <select id="ur-rule-select" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px;">
                    <option value="finkel">Finkel</option>
                    <option value="masters">Masters</option>
                    <option value="blitz">Blitz</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <label style="margin-right: 8px;">Bot:</label>
                <select id="ur-bot-select" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px;">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="panda">Panda</option>
                </select>
            </div>
            <button id="ur-new-game" style="width: 100%; background: #2c6bed; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">Start Game</button>
        `;
        document.body.appendChild(panel);
        
        const urlParams = new URLSearchParams(window.location.search);
        const currentRule = urlParams.get('rules') || 'finkel';
        const currentBot = urlParams.get('bot') || 'hard';
        
        const ruleSelect = document.getElementById('ur-rule-select');
        const botSelect = document.getElementById('ur-bot-select');
        if (ruleSelect.querySelector(`option[value="${currentRule}"]`)) {
            ruleSelect.value = currentRule;
        }
        if (botSelect.querySelector(`option[value="${currentBot}"]`)) {
            botSelect.value = currentBot;
        }
        
        document.getElementById('ur-new-game').addEventListener('click', () => {
            const rule = ruleSelect.value;
            const bot = botSelect.value;
            window.location.href = `https://royalur.net/game?tab=play&mode=computer&rules=${rule}&bot=${bot}`;
        });
    }

    function doAutoActions() {
        injectUI();

        const now = Date.now();
        if (now - lastActionTime < ACTION_COOLDOWN) return;

        let acted = false;

        // 1. Auto Roll Dice
        const rollableDice = document.querySelector('[class*="DiceUI_dice_container"][class*="DiceUI_can_be_rolled"]');
        if (rollableDice) {
            console.log("AutoPlayUr: Rolling dice...");
            rollableDice.click();
            acted = true;
        }

        // 2. Auto Play if only 1 move
        if (!acted) {
            // Find all playable elements that are not dice
            const allPlayable = document.querySelectorAll('[class*="can_be_"]:not([class*="DiceUI"])');
            if (allPlayable.length === 1) {
                console.log("AutoPlayUr: Only 1 playable piece found, clicking it...");
                allPlayable[0].click();
                acted = true;
            } else if (allPlayable.length === 0) {
                // Sometimes it's named differently, let's try another heuristic just in case
                const playablePieces = document.querySelectorAll('[class*="PieceUI_"][class*="playable"], [class*="Piece_"][class*="playable_"]');
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

    // Run every 200ms
    setInterval(doAutoActions, 200);
})();