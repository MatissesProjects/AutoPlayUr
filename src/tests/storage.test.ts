import { describe, it, expect } from 'vitest';
import { UrBot, UrRule } from '../constants';
import { Storage } from '../storage';

describe('Storage', () => {
  it('should return default settings when storage is empty', async () => {
    const settings = await Storage.getSettings();
    expect(settings.rules).toBe(UrRule.FINKEL);
    expect(settings.bot).toBe(UrBot.HARD);
  });

  it('should save and retrieve custom settings', async () => {
    Storage.setSettings({ rules: UrRule.BLITZ, bot: UrBot.PANDA });
    const settings = await Storage.getSettings();
    expect(settings.rules).toBe(UrRule.BLITZ);
    expect(settings.bot).toBe(UrBot.PANDA);
  });

  it('should update partial settings', async () => {
    Storage.setSettings({ bot: UrBot.EASY });
    const settings = await Storage.getSettings();
    expect(settings.rules).toBe(UrRule.FINKEL); // stays default
    expect(settings.bot).toBe(UrBot.EASY);
  });
});
