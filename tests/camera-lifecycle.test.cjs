const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(new URL('../camera-lifecycle.js', `file://${__filename}`), 'utf8');
function environment(getUserMedia) {
  const events = new Map();
  const elements = {};
  const container = {append(el) { elements[el.id] = el; }};
  const window = {
    addEventListener(name, fn) { events.set(name, fn); },
    dispatchEvent(event) { events.get(event.type)?.(); }
  };
  const document = {
    getElementById(id) { return elements[id]; },
    createElement() { return {style:{}, setAttribute() {}}; },
    querySelector() { return container; }, body:container
  };
  const context = {window, document, navigator:{mediaDevices:{getUserMedia}}, Event, DOMException};
  vm.runInNewContext(source, context);
  return {...context, elements, events};
}
test('switching tabs stops every track and repeated stop is safe', async () => {
  let stopped = 0;
  const e = environment(async () => ({getTracks: () => [{stop() { stopped++; }}]}));
  await e.navigator.mediaDevices.getUserMedia({video:true});
  e.window.studyCamera.stop();
  e.window.studyCamera.stop();
  assert.equal(stopped, 1);
});
test('camera permission resolving after tab close stops late stream', async () => {
  let resolve, stopped = 0;
  const e = environment(() => new Promise(r => resolve = r));
  const pending = e.navigator.mediaDevices.getUserMedia({video:true});
  e.window.studyCamera.stop();
  resolve({getTracks: () => [{stop() { stopped++; }}]});
  await assert.rejects(pending, {name:'AbortError'});
  assert.equal(stopped, 1);
});
test('denied permission shows Korean guidance and resets camera button event', async () => {
  let notified = false;
  const e = environment(async () => {throw new DOMException('Denied', 'NotAllowedError');});
  e.window.addEventListener('study-camera-error', () => notified = true);
  await assert.rejects(e.navigator.mediaDevices.getUserMedia({video:true}));
  assert.match(e.elements['camera-warning'].textContent, /권한이 거부/);
  assert.equal(notified, true);
});
test('fresh iframe can obtain a new camera stream after previous one stops', async () => {
  const a = environment(async () => ({getTracks: () => []}));
  a.window.studyCamera.stop();
  const stream = {getTracks: () => []};
  const b = environment(async () => stream);
  assert.equal(await b.navigator.mediaDevices.getUserMedia({video:true}), stream);
});
