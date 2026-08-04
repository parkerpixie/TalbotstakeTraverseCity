(() => {
  const STORAGE_KEY = 'tttc-install-guide-status-v2';
  const APP_ICON = '07-tttc-app-icon-full-bleed-1024x1024.png?v=20260803-4';
  let deferredInstallPrompt = null;

  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) manifestLink.href = 'manifest.webmanifest?v=20260803-4';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(error => {
        console.warn('TTTC service worker registration failed:', error);
      });
    });
  }

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isAndroid = /Android/i.test(navigator.userAgent);
  const isChrome = /Chrome|CriOS/i.test(navigator.userAgent) && !/EdgA|OPR|SamsungBrowser/i.test(navigator.userAgent);
  const isInAppBrowser = /FBAN|FBAV|Instagram|Line|GSA|wv\)/i.test(navigator.userAgent);

  if (isStandalone()) localStorage.setItem(STORAGE_KEY, 'installed');

  const dialog = document.createElement('dialog');
  dialog.className = 'install-guide-dialog';
  dialog.id = 'androidInstallGuide';
  dialog.innerHTML = `
    <div class="install-guide-shell">
      <button type="button" class="install-guide-close" aria-label="Close install guide">×</button>

      <section class="install-guide-step-panel" data-install-panel="question">
        <img class="install-guide-icon" src="${APP_ICON}" alt="Talbot's Take Traverse City app icon">
        <p class="install-guide-eyebrow">Save the trip app</p>
        <h2>Put Mani on this phone</h2>
        <p class="install-guide-copy">Saving the site to the home screen makes it open like an app and keeps the trip guide one tap away.</p>
        <div class="install-guide-actions">
          <button type="button" class="install-guide-primary" data-install-answer="no">Show me how</button>
          <button type="button" class="install-guide-secondary" data-install-answer="yes">It is already installed</button>
          <button type="button" class="install-guide-tertiary" data-install-answer="later">Not right now</button>
        </div>
      </section>

      <section class="install-guide-step-panel" data-install-panel="instructions" hidden>
        <img class="install-guide-icon" src="${APP_ICON}" alt="Talbot's Take Traverse City app icon">
        <p class="install-guide-eyebrow">Android + Chrome</p>
        <h2>Install Talbot's Take</h2>
        <p class="install-guide-copy" id="installGuideStatus">Use the one-tap button below. If Chrome does not offer it, the manual steps are right underneath.</p>
        <div class="install-guide-actions install-guide-native-action">
          <button type="button" class="install-guide-primary" data-install-now>Install now</button>
        </div>
        <ol class="install-guide-steps">
          <li class="install-guide-step">Make sure this page is open in <strong>Chrome</strong>, not inside Facebook, Gmail, or another app.</li>
          <li class="install-guide-step">Tap Chrome’s <strong>three-dot menu</strong>.</li>
          <li class="install-guide-step">Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
          <li class="install-guide-step">Confirm the final prompt. The T³C + Mani icon will appear with the rest of the apps.</li>
        </ol>
        <p class="install-guide-note" id="installGuideNote"></p>
        <div class="install-guide-actions">
          <button type="button" class="install-guide-secondary" data-copy-link>Copy site link</button>
          <button type="button" class="install-guide-secondary" data-install-finished>Done</button>
          <button type="button" class="install-guide-tertiary" data-install-remind>Remind me next time</button>
        </div>
      </section>

      <section class="install-guide-step-panel" data-install-panel="installed" hidden>
        <img class="install-guide-icon" src="${APP_ICON}" alt="Talbot's Take Traverse City app icon">
        <p class="install-guide-eyebrow">Already aboard</p>
        <h2>This app is already installed</h2>
        <p class="install-guide-copy">You are currently using the saved app version. Nothing else needs to be installed on this device.</p>
        <div class="install-guide-actions">
          <button type="button" class="install-guide-primary" data-install-finished>Got it</button>
        </div>
      </section>
    </div>`;
  document.body.appendChild(dialog);

  const panels = {
    question: dialog.querySelector('[data-install-panel="question"]'),
    instructions: dialog.querySelector('[data-install-panel="instructions"]'),
    installed: dialog.querySelector('[data-install-panel="installed"]')
  };
  const installNowButton = dialog.querySelector('[data-install-now]');
  const statusNode = dialog.querySelector('#installGuideStatus');
  const noteNode = dialog.querySelector('#installGuideNote');

  const showPanel = panelName => {
    Object.entries(panels).forEach(([name, panel]) => {
      panel.hidden = name !== panelName;
    });

    if (panelName === 'instructions') {
      installNowButton.textContent = deferredInstallPrompt ? 'Install now' : 'Show Chrome steps';
      statusNode.textContent = deferredInstallPrompt
        ? 'Chrome is ready to install the app on this phone.'
        : 'Chrome has not offered the one-tap installer yet. The manual steps below will still work.';

      if (isInAppBrowser) {
        noteNode.innerHTML = '<strong>This page appears to be inside another app.</strong> Copy the link, open Chrome, and paste it there before installing.';
      } else if (!isAndroid) {
        noteNode.textContent = 'These instructions are written for Android. On another device, use the browser’s Add to Home Screen or Install option.';
      } else if (!isChrome) {
        noteNode.innerHTML = '<strong>Open this page in Chrome</strong> for the most reliable Android installation.';
      } else {
        noteNode.textContent = 'Chrome may label the option “Install app” or “Add to Home screen,” depending on the phone version.';
      }
    }
  };

  const showDialog = () => {
    if (dialog.open) return;
    try {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } catch {
      dialog.setAttribute('open', '');
    }
  };

  const closeGuide = () => {
    try {
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    } catch {
      dialog.removeAttribute('open');
    }
  };

  const openGuide = ({ force = false, instructions = false } = {}) => {
    const status = localStorage.getItem(STORAGE_KEY);
    if (!force && (status === 'installed' || status === 'guided')) return;

    if (isStandalone()) showPanel('installed');
    else showPanel(instructions ? 'instructions' : 'question');
    showDialog();
  };

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!panels.instructions.hidden) showPanel('instructions');
  });

  dialog.querySelector('.install-guide-close').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'later');
    closeGuide();
  });

  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      localStorage.setItem(STORAGE_KEY, 'later');
      closeGuide();
    }
  });

  dialog.querySelector('[data-install-answer="yes"]').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'installed');
    closeGuide();
  });

  dialog.querySelector('[data-install-answer="no"]').addEventListener('click', () => showPanel('instructions'));

  dialog.querySelector('[data-install-answer="later"]').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'later');
    closeGuide();
  });

  dialog.querySelectorAll('[data-install-finished]').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, isStandalone() ? 'installed' : 'guided');
      closeGuide();
    });
  });

  dialog.querySelector('[data-install-remind]').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'later');
    closeGuide();
  });

  installNowButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
      statusNode.textContent = 'Use Chrome’s three-dot menu, then choose Install app or Add to Home screen.';
      noteNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      localStorage.setItem(STORAGE_KEY, 'installed');
      closeGuide();
    } else {
      statusNode.textContent = 'The installation was not completed. You can try again or use Chrome’s menu.';
    }
    deferredInstallPrompt = null;
    installNowButton.textContent = 'Show Chrome steps';
  });

  dialog.querySelector('[data-copy-link]').addEventListener('click', async event => {
    const button = event.currentTarget;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      button.textContent = 'Link copied';
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      button.textContent = 'Link copied';
    }
    window.setTimeout(() => { button.textContent = 'Copy site link'; }, 1600);
  });

  document.addEventListener('click', event => {
    const installLink = event.target.closest('[data-open-install-guide]');
    if (installLink) {
      event.preventDefault();
      event.stopPropagation();
      openGuide({ force: true, instructions: true });
      return;
    }

    const explorerChoice = event.target.closest('.explorer-choice[data-explorer-name]');
    if (!explorerChoice) return;
    const context = explorerChoice.closest('[data-explorer-context]')?.dataset.explorerContext;
    if (context === 'landing') window.setTimeout(() => openGuide(), 650);
  }, true);

  window.addEventListener('appinstalled', () => {
    localStorage.setItem(STORAGE_KEY, 'installed');
    closeGuide();
  });

  window.TTTCInstallGuide = { open: openGuide };
})();