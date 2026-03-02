import { Automation } from './actions';
import { POLL_INTERVAL_MS } from './constants';
import { UI } from './ui';

(() : void => {
  const VERSION = '1.2.0';
  console.info(`AutoPlayUr v${VERSION} content script loaded.`);

  // Initialize UI injection
  UI.inject();

  // Start main loop
  setInterval((): void => {
    Automation.run();
  }, POLL_INTERVAL_MS);
})();
