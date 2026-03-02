import { POLL_INTERVAL_MS } from './constants';
import { UI } from './ui';
import { Automation } from './actions';

(() => {
  const VERSION = '1.2.0';
  console.info(`AutoPlayUr v${VERSION} content script loaded.`);

  // Initialize UI injection
  UI.inject();

  // Start main loop
  setInterval(() => {
    Automation.run();
  }, POLL_INTERVAL_MS);
})();
