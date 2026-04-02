// content.js - improved option selection for Google Forms
chrome.runtime.onMessage.addListener((req) => {
  if (req && req.action === 'autofill') fillGoogleForm();
});

function fillGoogleForm() {
  chrome.storage.local.get('formData', (res) => {
    const d = res.formData || {};
    const labels = document.querySelectorAll('span.M7eMe');
    if (!labels.length) console.log('Autofill: no label spans (span.M7eMe) found.');

    labels.forEach(label => {
      const qText = (label.innerText || '').trim().toLowerCase();
      // try a few fallbacks to find the question block
      const container = label.closest('.geS5n') || label.closest('[jsmodel]') || label.closest('.Qr7Oae') || label.parentElement;
      if (!container) return;

      // fill text inputs
      const input = container.querySelector('input.whsOnd, textarea.whsOnd, input[type="text"], input[type="email"], input[type="tel"]');
      if (input) {
        let val = null;
        if (qText.includes('roll')) val = d.rollno;
        else if (qText.includes('student full name') || qText.includes('name')) val = d.name;
        else if (qText.includes('stream')) val = d.stream;
        else if (qText.includes('10th')) val = d.tenth;
        else if (qText.includes('12th')) val = d.twelfth;
        else if (qText.includes('graduation')) val = d.grad;
        else if (qText.includes('primary mobile')) val = d.primaryPhone;
        else if (qText.includes('alternate mobile')) val = d.altPhone;
        else if (qText.includes('personal email')) val = d.personalEmail;
        else if (qText.includes('college domain') || qText.includes('college email')) val = d.collegeEmail;

        if (val !== null && val !== undefined && String(val).length) {
          input.focus && input.focus();
          input.value = val;
          input.setAttribute('value', val);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`Autofill: set "${qText}" -> "${val}"`);
        }
      }

      // choice-type questions
      if (qText.includes('gender')) selectChoice(container, d.gender, qText);
      else if (qText.includes('college name')) selectChoice(container, d.college, qText);
      else if (qText.includes('course')) selectChoice(container, d.course, qText);
      else if (qText.includes('backlog') || qText.includes('backlogs')) selectChoice(container, d.backlog, qText);
    });

    console.log('Autofill: finished scanning questions.');
  });
}

/**
 * Try many strategies to find and click the option that matches `value`.
 * Returns true if click performed, false otherwise.
 */
function selectChoice(container, value, questionText = '') {
  if (!value) {
    console.log(`Autofill: no desired value provided for "${questionText}"`);
    return false;
  }
  const want = String(value).toLowerCase().trim();
  if (!want) return false;

  // Build candidate nodes to inspect (radios, options, labels, nodes with data-value)
  const candidates = Array.from(container.querySelectorAll(
    'div[role="radio"], div[role="option"], [role="option"], label, [data-value], .docssharedWizToggleLabeledContainer, .Od2TWd, .uVccjd'
  ));

  // include inner spans that often hold the visible text
  const spanCandidates = Array.from(container.querySelectorAll('.aDTYNe, .snByac, span'));
  const nodes = [...new Set([...candidates, ...spanCandidates])];

  // helper to extract normalized text from a node
  const extractText = (node) => {
    try {
      // prefer explicit attributes
      const aria = node.getAttribute && node.getAttribute('aria-label');
      if (aria && aria.trim()) return aria.trim();

      const dataVal = node.getAttribute && node.getAttribute('data-value');
      if (dataVal && dataVal.trim()) return dataVal.trim();

      // textContent / innerText
      const it = (node.innerText || node.textContent || '').trim();
      if (it) return it;

      // try common nested span classes
      const span = node.querySelector && (node.querySelector('.aDTYNe') || node.querySelector('.snByac') || node.querySelector('span'));
      if (span && (span.innerText || span.textContent)) return (span.innerText || span.textContent).trim();
    } catch (e) {
      // ignore extraction errors
    }
    return '';
  };

  // First pass: exact or contains match
  for (const node of nodes) {
    const txt = extractText(node);
    if (!txt) continue;
    const norm = txt.toLowerCase().trim();
    if (norm === want || norm.includes(want) || want.includes(norm)) {
      // find the real clickable element (prefer role=radio or label inside this node)
      let clickTarget = node;
      if ((node.getAttribute && node.getAttribute('role') !== 'radio')) {
        const r = node.querySelector && (node.querySelector('div[role="radio"], [role="radio"], label, .Od2TWd'));
        if (r) clickTarget = r;
      }
      // final fallback: search for ancestor that is clickable
      if (!clickTarget || !clickTarget.click) {
        const alt = node.closest && (node.closest('label') || node.closest('div[role="radio"]') || node.closest('.docssharedWizToggleLabeledContainer'));
        if (alt) clickTarget = alt;
      }

      try {
        clickTarget.click();
        console.log(`Autofill: clicked choice "${txt}" (wanted "${value}") for question "${questionText}"`);
        return true;
      } catch (e) {
        console.warn('Autofill: click failed on candidate, trying dispatch events', e);
        try {
          clickTarget.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          clickTarget.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          clickTarget.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          console.log(`Autofill: dispatched click events for "${txt}"`);
          return true;
        } catch (ee) {
          console.error('Autofill: clicking candidate failed', ee);
        }
      }
    }
  }

  // Second pass: direct radio search + check nested span text
  const radios = Array.from(container.querySelectorAll('div[role="radio"], [role="radio"]'));
  for (const r of radios) {
    let txt = '';
    try {
      txt = r.getAttribute && (r.getAttribute('aria-label') || r.getAttribute('data-value')) || (r.innerText || r.textContent || '');
      if (!txt) {
        const sp = r.querySelector && (r.querySelector('.aDTYNe') || r.querySelector('.snByac') || r.querySelector('span'));
        if (sp) txt = (sp.innerText || sp.textContent || '').trim();
      }
    } catch (e) {}
    if (!txt) continue;
    const norm = txt.toLowerCase().trim();
    if (norm === want || norm.includes(want) || want.includes(norm)) {
      try {
        r.click();
        console.log(`Autofill: clicked radio "${txt}" (wanted "${value}")`);
        return true;
      } catch (e) {
        try {
          r.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          r.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          r.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          console.log(`Autofill: dispatched click events for radio "${txt}"`);
          return true;
        } catch (ee) {}
      }
    }
  }

  console.log(`Autofill: no matching option found for "${value}" in question "${questionText}"`);
  return false;
}
