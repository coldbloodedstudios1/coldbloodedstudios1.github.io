/* Vanilla JavaScript. Review tools change only this document; no publishing API is used. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const root = document.documentElement;
  const menu = document.getElementById('primary-nav');
  const menuToggle = document.getElementById('menu-toggle');
  const dialogs = Array.from(document.querySelectorAll('dialog'));
  const settingsNode = document.getElementById('site-settings');
  const form = document.getElementById('link-form');
  const formError = document.getElementById('form-error');
  const summary = document.getElementById('setup-summary');
  const keys = ['gilt', 'pocket', 'devlog', 'github', 'kofi', 'itch', 'discord', 'email'];
  let settings = {};
  let toastTimer;
  const dialogTriggers = new Map();
  try { settings = JSON.parse(settingsNode.textContent); }
  catch (_) { settings = Object.fromEntries(keys.map(key => [key, ''])); }

  function toast(message) {
    const node = document.getElementById('toast');
    clearTimeout(toastTimer);
    node.textContent = message;
    node.hidden = false;
    toastTimer = setTimeout(() => { node.hidden = true; }, 4000);
  }
  function setMenu(open, restoreFocus = false) {
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('pointerdown', event => {
    if (menu.classList.contains('open') && !document.getElementById('header').contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) setMenu(false, true);
  });
  const mobileQuery = matchMedia('(max-width: 760px)');
  mobileQuery.addEventListener('change', () => setMenu(false));

  function openDialog(id, trigger) {
    const dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function') {
      toast('This browser does not support the review dialog. Open the file in a recent browser.');
      return;
    }
    setMenu(false);
    dialogTriggers.set(id, trigger || document.activeElement);
    if (id === 'setup-dialog') {
      keys.forEach(key => { form.elements.namedItem(key).value = settings[key] || ''; });
      formError.hidden = true;
      updateSummary();
    }
    document.body.classList.add('modal-open');
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector('[data-close]').focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => openDialog(button.dataset.open, button));
  });
  dialogs.forEach(dialog => {
    // Keep keyboard navigation inside the active modal, including one-control dialogs.
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || !dialog.open) return;
      const focusable = Array.from(dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'))
        .filter(node => node.getClientRects().length && node.getAttribute('aria-disabled') !== 'true');
      if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (focusable.length === 1 || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      // Close only when clicking the backdrop, not the dialog's interior padding.
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!dialogs.some(item => item.open)) document.body.classList.remove('modal-open');
      const trigger = dialogTriggers.get(dialog.id);
      if (trigger && trigger.isConnected && !dialogs.some(item => item.open)) trigger.focus({ preventScroll: true });
    });
    dialog.querySelectorAll('[data-switch]').forEach(button => button.addEventListener('click', () => {
      const initialTrigger = dialogTriggers.get(dialog.id);
      dialog.close();
      openDialog(button.dataset.switch, initialTrigger);
    }));
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('[data-fallback]');
    if (link) { event.preventDefault(); openDialog(link.dataset.fallback, link); }
  });
  const cards = Array.from(document.querySelectorAll('[data-category]'));
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(item => {
        const chosen = item === button;
        item.classList.toggle('active', chosen);
        item.setAttribute('aria-pressed', String(chosen));
      });
      let count = 0;
      cards.forEach(card => {
        const visible = category === 'all' || card.dataset.category === category;
        card.hidden = !visible;
        if (visible) count += 1;
      });
      document.getElementById('network-count').textContent = `${count} destination${count === 1 ? '' : 's'}`;
    });
  });

  // Motion preferences are honored without tracking or persistent storage.
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.getElementById('motion-toggle');
  let manuallyPaused = false;
  function syncMotion() {
    const paused = reduceMotion.matches || manuallyPaused;
    root.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.disabled = reduceMotion.matches;
    motionButton.querySelector('span').textContent = reduceMotion.matches ? 'Reduced motion on' : paused ? 'Resume motion' : 'Pause motion';
    motionButton.title = reduceMotion.matches ? 'Using your device accessibility preference' : 'Pause or resume decorative animation';
  }
  motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; syncMotion(); });
  reduceMotion.addEventListener('change', syncMotion);
  syncMotion();
  document.addEventListener('visibilitychange', () => root.classList.toggle('tab-hidden', document.hidden));

  function validAddress(value, key) {
    if (!value) return '';
    if (key === 'email') {
      if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) || /[?\r\n]/.test(value)) throw new Error('Enter a valid public business email address.');
      return value;
    }
    let parsed;
    try { parsed = new URL(value); }
    catch (_) { throw new Error('Enter a complete HTTPS website address, or leave the field blank.'); }
    if (parsed.protocol !== 'https:' || !parsed.hostname.includes('.') || parsed.username || parsed.password) {
      throw new Error('Use a public HTTPS address without embedded credentials.');
    }
    return parsed.href;
  }
  function readForm() {
    formError.hidden = true;
    if (!form.reportValidity()) return null;
    const result = {};
    for (const key of keys) {
      const field = form.elements.namedItem(key);
      try { result[key] = validAddress(field.value.trim(), key); }
      catch (error) {
        formError.textContent = error.message;
        formError.hidden = false;
        field.focus();
        return null;
      }
    }
    return result;
  }
  function updateSummary(message = '') {
    const count = keys.filter(key => key !== 'email' && settings[key]).length;
    summary.textContent = `${message ? message + ' ' : ''}${count} of 7 website destinations linked. ${settings.email ? 'Business email set.' : 'Business email not set.'} Nothing is published.`;
  }
  function replaceFirstText(link, text) {
    const node = Array.from(link.childNodes).find(item => item.nodeType === Node.TEXT_NODE);
    if (node) node.textContent = text + ' ';
    else link.prepend(document.createTextNode(text + ' '));
  }
  function applySettings(values) {
    settings = { ...values };
    settingsNode.textContent = JSON.stringify(settings).replace(/</g, '\\u003c');
    keys.forEach(key => {
      let safe = '';
      try { safe = validAddress(settings[key] || '', key); }
      catch (_) { settings[key] = ''; }
      document.querySelectorAll(`[data-destination="${key}"]`).forEach(link => {
        const isDirectory = link.classList.contains('destination-link');
        if (safe) {
          delete link.dataset.fallback;
          link.href = key === 'email' ? 'mailto:' + safe : safe;
          link.removeAttribute('aria-disabled');
          if (key !== 'email') {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.title = 'Opens an external website in a new tab';
          } else {
            link.removeAttribute('target');
            link.removeAttribute('rel');
            link.title = 'Open your email app';
          }
        } else {
          link.removeAttribute('href');
          link.removeAttribute('target');
          link.removeAttribute('rel');
          link.setAttribute('aria-disabled', 'true');
          link.title = 'Coming soon';
          const fallback = isDirectory && ({ gilt: 'gilt-dialog', devlog: 'devlog-dialog' })[key];
          if (fallback) {
            link.href = '#' + fallback;
            link.dataset.fallback = fallback;
            link.removeAttribute('aria-disabled');
            link.title = 'Open the local project overview. External website address is not set.';
          }
        }
        if (!isDirectory && !link.hasAttribute('data-fixed-label')) {
          if (key === 'email') replaceFirstText(link, safe || 'Business email to confirm');
          if (key === 'gilt') replaceFirstText(link, safe ? 'Visit Gilt & Guilt' : 'Game website to confirm');
          if (key === 'devlog') replaceFirstText(link, safe ? 'Open development journal' : 'Development website to confirm');
          if (key === 'pocket') replaceFirstText(link, safe ? 'Visit Pocket Vein' : 'Pocket Vein address to confirm');
        }
      });
      document.querySelectorAll(`[data-link-status="${key}"]`).forEach(node => {
        node.textContent = safe ? 'External website' : key === 'gilt' ? 'Project overview · website link pending' : key === 'devlog' ? 'Dated snapshot · website link pending' : 'Address to confirm';
      });
    });
    const contactNote = document.querySelector('.contact-note');
    contactNote.textContent = settings.email ? 'For business, press, and collaboration inquiries.' : 'More ways to contact the studio are coming soon.';
  }
  const railLinks = Array.from(document.querySelectorAll('.section-rail a'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        railLinks.forEach(link => {
          const chosen = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', chosen);
          if (chosen) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
    railLinks.forEach(link => { const target = document.querySelector(link.hash); if (target) observer.observe(target); });
  }
  // The dated project update is intentionally fixed; only the footer year is dynamic.
  document.getElementById('year').textContent = new Date().getFullYear();
  applySettings(Object.fromEntries(keys.map(key => [key, settings[key] || ''])));
})();
