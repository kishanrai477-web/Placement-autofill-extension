document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');

  // Load saved data into popup
  chrome.storage.local.get('formData', (res) => {
    const d = res.formData || {};
    const ids = ['rollno','name','college','course','stream','tenth','twelfth','grad','primaryPhone','altPhone','personalEmail','collegeEmail'];
    ids.forEach(id => { if (d[id]) document.getElementById(id).value = d[id]; });

    if (d.gender) document.querySelector(`input[name="gender"][value="${d.gender}"]`)?.setAttribute('checked', true);
    if (d.backlog) document.querySelector(`input[name="backlog"][value="${d.backlog}"]`)?.setAttribute('checked', true);
  });

  // Save
  document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = collectFormData();
    chrome.storage.local.set({ formData: data }, () => {
      status.textContent = 'Saved ✓';
      setTimeout(() => status.textContent = '', 1500);
    });
  });

  // Autofill
  document.getElementById('autofillBtn').addEventListener('click', () => {
    const data = collectFormData();
    chrome.storage.local.set({ formData: data }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'autofill' });
        }
      });
    });
  });

  function collectFormData() {
    return {
      rollno: document.getElementById('rollno').value,
      name: document.getElementById('name').value,
      gender: document.querySelector('input[name="gender"]:checked')?.value || "",
      college: document.getElementById('college').value,
      course: document.getElementById('course').value,
      stream: document.getElementById('stream').value,
      tenth: document.getElementById('tenth').value,
      twelfth: document.getElementById('twelfth').value,
      grad: document.getElementById('grad').value,
      backlog: document.querySelector('input[name="backlog"]:checked')?.value || "",
      primaryPhone: document.getElementById('primaryPhone').value,
      altPhone: document.getElementById('altPhone').value,
      personalEmail: document.getElementById('personalEmail').value,
      collegeEmail: document.getElementById('collegeEmail').value
    };
  }
});
