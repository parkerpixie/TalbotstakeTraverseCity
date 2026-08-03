(() => {
  const STORAGE_KEY = 'tttc-install-guide-status-v1';
  let deferredInstallPrompt = null;

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

  if (isStandalone()) {
    localStorage.setItem(STORAGE_KEY, 'installed');
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'install-guide-dialog';
  dialog.id = 'androidInstallGuide';
  dialog.innerHTML = `
    <div class="install-guide-shell">
      <button type="button" class="install-guide-close" aria-label="Close install guide">×</button>

      <section class="install-guide-step-panel" data-install-panel="question">
        <img class="install-guide-icon" src="tttc-app-icon-display-rounded-1024x1024.png" alt="Talbot's Take Traverse City app icon">
        <p class="install-guide-eyebrow">One quick phone thing</p>
        <h2>Is the trip app already saved?</h2>
        <p class="install-guide-copy">Saving it to the home screen makes it open like an app, keeps the T³C otter icon handy, and avoids hunting for the link again.</p>
        <div class="install-guide-actions">
          <button type="button" class="install-guide-primary" data-install-answer="yes">Yes, it is saved</button>
          <button type="button" class="install-guide-secondary" data-install-answer="no">Not yet. Show me.</button>
          <button type="button" class="install-guide-tertiary" data-install-answer="later">Ask me next time</button>
        </div>
      </section>

      <section class="install-guide-step-panel" data-install-panel="instructions" hidden>
        <img class="install-guide-icon" src="tttc-app-icon-display-rounded-1024x1024.png" alt="Talbot's Take Traverse City app icon">
        <p class="install-guide-eyebrow">Android + Chrome</p>
        <h2>Put the otter on your home screen</h2>
        <ol class="install-guide-steps">
          <li class="install-guide-step">Open this page in <strong>Chrome</strong>.</li>
          <li class="install-guide-step">Tap the <strong>three-dot menu</strong> beside the address bar.</li>
          <li class="install-guide-step">Tap <strong>Add to Home screen</strong>, then <strong>Install</strong>.</li>
          <li class="install-guide-step">Follow the final phone prompt. The T³C otter icon will appear with the rest of the apps.</li>
        </ol>
        <p class="install-guide-note">Depending on the Android phone and Chrome version, the menu may say <strong>Install app</strong> instead of <strong>Add to Home screen</strong>.</p>
        <div class="install-guide-actions">
          <button type="button" class="install-guide-primary" data-install-now hidden>Install now</button>
          <button type="button" class="install-guide-secondary" data-install-finished>Got it</button>
          <button type="button" class="install-guide-tertiary" data-install-remind>Remind me next time</button>
        </div>
      </section>
    </div>`;
  document.body.appendChild(dialog);

  const questionPanel = dialog.querySelector('[data-install-panel="question"]');
  const instructionPanel = dialog.querySelector('[data-install-panel="instructions"]');
  const installNowButton = dialog.querySelector('[data-install-now]');

  const showPanel = panelName => {
    const showInstructions = panelName === 'instructions';
    questionPanel.hidden = showInstructions;
    instructionPanel.hidden = !showInstructions;
    installNowButton.hidden = !deferredInstallPrompt;
  };

  const closeGuide = () => {
    if (dialog.open) dialog.close();
  };

  const openGuide = ({ force = false, instructions = false } = {}) => {
    if (isStandalone()) return;
    const status = localStorage.getItem(STORAGE_KEY);
    if (!force && (status === 'installed' || status === 'guided')) return;
    showPanel(instructions ? 'instructions' : 'question');
    if (!dialog.open) dialog.showModal();
  };

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

  dialog.querySelector('[data-install-answer="no"]').addEventListener('click', () => {
    showPanel('instructions');
  });

  dialog.querySelector('[data-install-answer="later"]').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'later');
    closeGuide();
  });

  dialog.querySelector('[data-install-finished]').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'guided');
    closeGuide();
  });

  dialog.querySelector('[data-install-remind]').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'later');
    closeGuide();
  });

  installNowButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      localStorage.setItem(STORAGE_KEY, 'installed');
      closeGuide();
    }
    deferredInstallPrompt = null;
    installNowButton.hidden = true;
  });

  document.addEventListener('click', event => {
    const installLink = event.target.closest('[data-open-install-guide]');
    if (installLink) {
      event.preventDefault();
      openGuide({ force: true, instructions: true });
      return;
    }

    const explorerChoice = event.target.closest('.explorer-choice[data-explorer-name]');
    if (!explorerChoice) return;
    const context = explorerChoice.closest('[data-explorer-context]')?.dataset.explorerContext;
    if (context !== 'landing') return;

    window.setTimeout(() => openGuide(), 650);
  });

  window.addEventListener('appinstalled', () => {
    localStorage.setItem(STORAGE_KEY, 'installed');
    closeGuide();
  });
})();
