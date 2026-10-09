const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.getElementById('study-panel');
let current = null;
function selectStudy(tab) {
  if (current === tab.dataset.study) return;
  const previous = panel.querySelector('iframe');
  if (previous) {
    previous.contentWindow?.studyCamera?.stop();
    previous.src = 'about:blank';
    previous.remove();
  }
  current = tab.dataset.study;
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  }
  panel.setAttribute('aria-labelledby', tab.id);
  const frame = document.createElement('iframe');
  frame.title = `${tab.textContent} — Interactive Study`;
  frame.allow = 'camera';
  frame.src = `projects/${current}/index.html`;
  panel.append(frame);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStudy(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    selectStudy(tabs[next]);
  });
});
selectStudy(tabs[0]);
