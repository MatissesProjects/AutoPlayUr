import { vi } from 'vitest';

// Mock chrome.storage.local
const mockStorage: Record<string, any> = {};

global.chrome = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => {
        const result: Record<string, any> = {};
        const keyList = Array.isArray(keys) ? keys : [keys];
        keyList.forEach((key) => {
          if (mockStorage[key] !== undefined) {
            result[key] = mockStorage[key];
          }
        });
        callback(result);
      }),
      set: vi.fn((data, callback) => {
        Object.assign(mockStorage, data);
        if (callback) callback();
      }),
    },
  },
} as any;

// Reset storage before each test
beforeEach(() => {
  vi.clearAllMocks();
  for (const key in mockStorage) {
    delete mockStorage[key];
  }
});
