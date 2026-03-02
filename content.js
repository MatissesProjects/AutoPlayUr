(function() {
    const VERSION = "1.0";
    console.info(`AutoPlayUr v${VERSION} content script loaded.`);

    let lastRollTime = 0;
    const ROLL_COOLDOWN = 1000; // 1s cooldown between clicks to be safe

    function autoRoll() {
        const now = Date.now();
        if (now - lastRollTime < ROLL_COOLDOWN) return;

        // The dice container has a class that includes 'Dice_dice_container'
        // and when it's rollable, it has a class containing 'can_roll'
        const rollableDice = document.querySelector('[class*="Dice_dice_container"][class*="can_roll"]');
        
        if (rollableDice) {
            console.log("AutoPlayUr: Rolling dice...");
            rollableDice.click();
            lastRollTime = now;
        }
    }

    // Run every 200ms for faster detection but limited by ROLL_COOLDOWN
    setInterval(autoRoll, 200);
})();
