const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
test('SYMBOL completes the original six-symbol cycle', () => {
  const symbol = {};
  let click;
  const button = {addEventListener(_, fn) {click = fn;}};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'projects/symbol/sketch.js'), 'utf8'), {
    document:{getElementById: id => id === 'symbol' ? symbol : button}
  });
  assert.equal(symbol.textContent, '#');
  for (const value of ['$', '%', '^', '*', '!', '#']) {click(); assert.equal(symbol.textContent, value);}
});
test('EMOJI draws five requested emojis, follows landmarks, and raises crown', async () => {
  let source = fs.readFileSync(path.join(root, 'projects/emoji/index.html'), 'utf8').match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  source = source.replace(/import\s*\{[\s\S]*?\}\s*from\s*"[^"]+";/, '');
  let sketch;
  const drawn = [], positions = [];
  const landmarks = Array.from({length:478}, () => ({x:.5,y:.5}));
  landmarks[468] = {x:.4,y:.4}; landmarks[473] = {x:.6,y:.4};
  landmarks[10] = {x:.5,y:.25};
  const video = {elt:{videoWidth:640, readyState:4, currentTime:1, addEventListener() {}}, size() {}, hide() {}};
  const noop = () => {};
  function P5(fn) {
    sketch = {CENTER:0, createCanvas:() => ({parent:noop}), createCapture:() => video,
      pixelDensity:noop,textAlign:noop,textFont:noop,background:noop,push:noop,pop:noop,
      translate:(x,y) => positions.push({x,y}),scale:noop,image:noop,noStroke:noop,textSize:noop,
      text:e => drawn.push(e)};
    fn(sketch);
    sketch.setup();
  }
  await vm.runInNewContext(`(async () => {${source}})()`, {
    p5:P5, console, performance, document:{getElementById:() => ({style:{}})},
    FilesetResolver:{forVisionTasks: async () => ({})},
    FaceLandmarker:{createFromOptions:async () => ({detectForVideo:() => ({faceLandmarks:[landmarks]})})}
  });
  sketch.draw();
  assert.deepEqual(drawn, ['⭐️','⭐️','🎱','💵','👑']);
  assert.ok(Math.abs(positions.at(-1).y - (120 - 128 * .55)) < .001);
  const originalEyeX = positions[1].x;
  landmarks[468].x += .1; video.elt.currentTime++;
  positions.length = 0; sketch.draw();
  assert.ok(positions[1].x > originalEyeX);
});
test('HALFTONE starts capture, renders DOT/ASCII, and responds to size slider', () => {
  const source = fs.readFileSync(path.join(root, 'projects/halftone/index.html'), 'utf8').match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  let sketch, start, circles = 0, letters = 0;
  const controls = {gap:{value:'12'}, mode:{value:'dot'}, startCam:{addEventListener(_,fn) {start=fn;}}};
  const noop = () => {};
  function P5(fn) {
    sketch = {CENTER:0, createCanvas:() => ({parent:noop}),
      createCapture:(_,ready) => {ready(); return {width:640,height:480,pixels:new Uint8Array(640*480*4),loadPixels:noop,hide:noop};},
      noStroke:noop,pixelDensity:noop,textFont:noop,background:noop,fill:noop,textAlign:noop,textSize:noop,
      text:() => letters++,circle:() => circles++, constrain:(v,min,max) => Math.max(min,Math.min(max,v)),
      map:(v,a,b,c,d) => c + (v-a)/(b-a)*(d-c)};
    fn(sketch);sketch.setup();
  }
  vm.runInNewContext(source, {p5:P5,document:{getElementById:id=>controls[id]},window:{addEventListener:noop}});
  start(); assert.equal(controls.startCam.disabled, true);
  sketch.draw();assert.equal(circles, Math.floor(640/12)*Math.floor(480/12));
  circles=0;controls.gap.value='24';sketch.draw();
  assert.equal(circles, Math.floor(640/24)*Math.floor(480/24));
  controls.mode.value='ascii';letters=0;circles=0;sketch.draw();
  assert.equal(circles,0);assert.equal(letters,Math.floor(640/24)*Math.floor(480/24));
});
test('CLOCK loads its image, keeps 391px diameter, and updates hand angles', () => {
  const source=fs.readFileSync(path.join(root,'projects/clock/sketch.js'),'utf8');
  let imagePath, second=10;
  const rotations=[],ellipses=[];
  const noop=()=>{};
  const context={windowWidth:900,windowHeight:620,width:900,height:620,DEGREES:0,CENTER:0,
    loadImage:p=>{imagePath=p;return {width:300,height:300};},createCanvas:noop,angleMode:noop,describe:noop,
    background:noop,translate:noop,scale:noop,drawingContext:{save:noop,beginPath:noop,arc:noop,clip:noop,restore:noop},
    max:Math.max,imageMode:noop,image:noop,noFill:noop,stroke:noop,strokeWeight:noop,ellipse:(...v)=>ellipses.push(v),
    second:()=>second,minute:()=>20,hour:()=>3,map:(v,a,b,c,d)=>c+(v-a)/(b-a)*(d-c),
    push:noop,pop:noop,rotate:v=>rotations.push(v),line:noop,point:noop,noStroke:noop,fill:noop};
  vm.createContext(context);vm.runInContext(source,context);
  context.preload();context.setup();context.draw();
  assert.equal(imagePath,'코리락.jpg');assert.equal(ellipses[0][2],391);
  assert.deepEqual(rotations.slice(0,3),[60,120,90]);
  second=11;rotations.length=0;context.draw();assert.equal(rotations[0],66);
});
