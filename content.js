(function() {
    const VERSION = "1.0.3";
    console.info(`AutoPlayUr v${VERSION} content script loaded.`);

    let lastRollTime = 0;
    const ROLL_COOLDOWN = 1000;

    function autoRoll() {
        const now = Date.now();
        if (now - lastRollTime < ROLL_COOLDOWN) return;

        // Using the actual class names found in debug:
        // DiceUI_dice_container__C7X52 and DiceUI_can_be_rolled__D4NCX
        const rollableDice = document.querySelector('[class*="DiceUI_dice_container"][class*="DiceUI_can_be_rolled"]');
        
        if (rollableDice) {
            console.log("AutoPlayUr: Rolling dice...");
            rollableDice.click();
            lastRollTime = now;
        }
    }

    // Run every 200ms
    setInterval(autoRoll, 200);
})();
