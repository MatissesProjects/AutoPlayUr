import { UrRule, UrBot, UI_CONSTANTS } from './constants';
import { Storage } from './storage';

export const UI = {
  /**
   * Injects the control panel into the page
   */
  async inject(): Promise<void> {
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
      border: '1px solid #444',
    });

    panel.innerHTML = `
      <div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 4px;">AutoPlayUr</div>
      <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
          <label style="margin-right: 8px;">Rules:</label>
          <select id="${
            UI_CONSTANTS.RULE_SELECT_ID
          }" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px;">
              ${Object.values(UrRule)
                .map((r) => `<option value="${r}">${r.charAt(0).toUpperCase() + r.slice(1)}</option>`)
                .join('')}
          </select>
      </div>
      <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <label style="margin-right: 8px;">Bot:</label>
          <select id="${
            UI_CONSTANTS.BOT_SELECT_ID
          }" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px;">
              ${Object.values(UrBot)
                .map((b) => `<option value="${b}">${b.charAt(0).toUpperCase() + b.slice(1)}</option>`)
                .join('')}
          </select>
      </div>
      <button id="${
        UI_CONSTANTS.START_BTN_ID
      }" style="width: 100%; background: #2c6bed; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">Start Game</button>
    `;
    document.body.appendChild(panel);

    const ruleSelect = document.getElementById(UI_CONSTANTS.RULE_SELECT_ID) as HTMLSelectElement;
    const botSelect = document.getElementById(UI_CONSTANTS.BOT_SELECT_ID) as HTMLSelectElement;
    const startBtn = document.getElementById(UI_CONSTANTS.START_BTN_ID) as HTMLButtonElement;

    // Load saved settings or defaults
    const settings = await Storage.getSettings();
    const urlParams = new URLSearchParams(window.location.search);
    const currentRule = (urlParams.get('rules') as UrRule) || settings.rules;
    const currentBot = (urlParams.get('bot') as UrBot) || settings.bot;

    ruleSelect.value = currentRule;
    botSelect.value = currentBot;

    // Sync storage
    if (currentRule !== settings.rules || currentBot !== settings.bot) {
      Storage.setSettings({ rules: currentRule, bot: currentBot });
    }

    // Event listeners
    ruleSelect.addEventListener('change', () => Storage.setSettings({ rules: ruleSelect.value as UrRule }));
    botSelect.addEventListener('change', () => Storage.setSettings({ bot: botSelect.value as UrBot }));
    startBtn.addEventListener('click', () => {
      window.location.href = `https://royalur.net/game?tab=play&mode=computer&rules=${ruleSelect.value}&bot=${botSelect.value}`;
    });
  },
};
