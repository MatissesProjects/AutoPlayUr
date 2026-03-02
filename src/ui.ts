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
    
    // Initial Styles
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(20,20,20,0.95)',
      color: '#eee',
      padding: '0',
      borderRadius: '8px',
      zIndex: '999999',
      fontFamily: 'sans-serif',
      fontSize: '13px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
      border: '1px solid #444',
      overflow: 'hidden',
      transition: 'height 0.3s ease',
      width: '180px'
    });

    panel.innerHTML = `
      <div id="ur-panel-header" style="background: #333; padding: 8px 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; user-select: none;">
        <span style="font-weight: bold;">AutoPlayUr</span>
        <span id="ur-panel-toggle" style="cursor: pointer; padding: 2px 6px; background: #444; border-radius: 4px; font-size: 10px;">_</span>
      </div>
      <div id="ur-panel-content" style="padding: 12px;">
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <label style="margin-right: 8px;">Rules:</label>
            <select id="${UI_CONSTANTS.RULE_SELECT_ID}" style="background: #222; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px; width: 80px;">
                ${Object.values(UrRule)
                  .map((r) => `<option value="${r}">${r.charAt(0).toUpperCase() + r.slice(1)}</option>`)
                  .join('')}
            </select>
        </div>
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <label style="margin-right: 8px;">Bot:</label>
            <select id="${UI_CONSTANTS.BOT_SELECT_ID}" style="background: #222; color: white; border: 1px solid #555; border-radius: 4px; padding: 2px; width: 80px;">
                ${Object.values(UrBot)
                  .map((b) => `<option value="${b}">${b.charAt(0).toUpperCase() + b.slice(1)}</option>`)
                  .join('')}
            </select>
        </div>
        <button id="${UI_CONSTANTS.START_BTN_ID}" style="width: 100%; background: #2c6bed; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">Start Game</button>
      </div>
    `;
    document.body.appendChild(panel);

    this.setupInteractions(panel);
  },

  async setupInteractions(panel: HTMLElement): Promise<void> {
    const header = document.getElementById('ur-panel-header')!;
    const toggle = document.getElementById('ur-panel-toggle')!;
    const content = document.getElementById('ur-panel-content')!;
    const ruleSelect = document.getElementById(UI_CONSTANTS.RULE_SELECT_ID) as HTMLSelectElement;
    const botSelect = document.getElementById(UI_CONSTANTS.BOT_SELECT_ID) as HTMLSelectElement;
    const startBtn = document.getElementById(UI_CONSTANTS.START_BTN_ID) as HTMLButtonElement;

    // 1. Draggable Logic
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offset = {
        x: e.clientX - panel.getBoundingClientRect().left,
        y: e.clientY - panel.getBoundingClientRect().top
      };
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panel.style.bottom = 'auto';
      panel.style.right = 'auto';
      panel.style.left = `${e.clientX - offset.x}px`;
      panel.style.top = `${e.clientY - offset.y}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // 2. Minimize Logic
    toggle.addEventListener('click', () => {
      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.innerText = '_';
      } else {
        content.style.display = 'none';
        toggle.innerText = '+';
      }
    });

    // 3. Storage & Settings Logic
    const settings = await Storage.getSettings();
    const urlParams = new URLSearchParams(window.location.search);
    const currentRule = (urlParams.get('rules') as UrRule) || settings.rules;
    const currentBot = (urlParams.get('bot') as UrBot) || settings.bot;

    ruleSelect.value = currentRule;
    botSelect.value = currentBot;

    if (currentRule !== settings.rules || currentBot !== settings.bot) {
      Storage.setSettings({ rules: currentRule, bot: currentBot });
    }

    ruleSelect.addEventListener('change', () => Storage.setSettings({ rules: ruleSelect.value as UrRule }));
    botSelect.addEventListener('change', () => Storage.setSettings({ bot: botSelect.value as UrBot }));
    startBtn.addEventListener('click', () => {
      window.location.href = `https://royalur.net/game?tab=play&mode=computer&rules=${ruleSelect.value}&bot=${botSelect.value}`;
    });
  }
};
