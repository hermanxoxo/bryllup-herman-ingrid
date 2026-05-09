// Tab-navigasjon i programseksjonen
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.day-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.day;

    tabs.forEach(t => {
      t.classList.remove('tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('tab--active');
    tab.setAttribute('aria-selected', 'true');

    panels.forEach(panel => panel.classList.remove('day-panel--active'));
    const activePanel = document.getElementById(target);
    if (activePanel) activePanel.classList.add('day-panel--active');
  });
});

// Kopier rabattkode til utklippstavlen
function copyCode() {
  const code = document.getElementById('hotelCode').textContent.trim();
  const confirm = document.getElementById('copyConfirm');

  navigator.clipboard.writeText(code).then(() => {
    confirm.classList.add('visible');
    setTimeout(() => confirm.classList.remove('visible'), 2000);
  });
}
