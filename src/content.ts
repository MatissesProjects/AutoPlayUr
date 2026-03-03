import { Automation } from './actions';
import { UI } from './ui';

(() : void => {
  const VERSION = '1.2.1';
  console.info(`AutoPlayUr v${VERSION} content script loaded.`);

  // Initialize UI injection
  UI.inject();

  // Optimized run: Only run when the DOM changes
  const observer = new MutationObserver(() => {
    Automation.run();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  // Initial run in case the page is already in a playable state
  Automation.run();
})();
