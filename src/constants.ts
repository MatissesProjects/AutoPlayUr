export enum UrRule {
  FINKEL = 'finkel',
  MASTERS = 'masters',
  BLITZ = 'blitz',
  CUSTOM = 'custom',
}

export enum UrBot {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  PANDA = 'panda',
}

export interface AppSettings {
  rules: UrRule;
  bot: UrBot;
}

export const ACTION_COOLDOWN_MS = 600;

export const UI_CONSTANTS = {
  PANEL_ID: 'autoplayur-panel',
  RULE_SELECT_ID: 'ur-rule-select',
  BOT_SELECT_ID: 'ur-bot-select',
  START_BTN_ID: 'ur-new-game',
};
