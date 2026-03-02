import { UrBot, UrRule, AppSettings } from './constants';

export const Storage = {
  getSettings(): Promise<AppSettings> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['rules', 'bot'], (result) => {
        resolve({
          rules: (result.rules as UrRule) || UrRule.FINKEL,
          bot: (result.bot as UrBot) || UrBot.HARD,
        });
      });
    });
  },

  setSettings(settings: Partial<AppSettings>): void {
    chrome.storage.local.set(settings);
  },
};
