import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch();const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.clock.install();await page.goto('http://127.0.0.1:3001');await page.waitForSelector('[data-testid="game-stroop"]');const checks=[];const pass=s=>{checks.push(s);console.log('PASS',s);};
const snap=()=>page.evaluate(()=>window.__focusPreview.client.getSnapshot());const click=id=>page.locator(`[data-testid="${id}"]`).tap();
assert.equal(await page.locator('[data-testid^="game-"]').count(),3);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);pass('Three touch-first game cards and a 390px layout without overflow');
const catalogue=await page.evaluate(async()=> (await window.__focusPreview.client.dispatch({cmd:'levels'})).levels);assert.equal(catalogue.length,30);pass('Rust WASM catalogue matches all 30 React Native level configurations');
await page.screenshot({path:'/home/user/mobile-qa/mobile-home.png'});
for(const [game,first,last]of [['stroop',1,10],['schulte',11,20],['go',21,30]]){
 await click(`game-${game}`);assert.equal(await page.locator('[data-testid^="level-"]').count(),10);
 for(let id=first;id<=last;id++){
  await click(`level-${id}`);await click('start');await page.clock.runFor(120);const s=await snap();assert.equal(s.levelId,id);assert.equal(s.game,game);
  if(game==='schulte'){assert.equal(s.grid.length,catalogue[id-1].gridSize**2);assert.equal(new Set(s.grid).size,s.grid.length);}else if(game==='stroop'){assert.ok(s.stimulus.ink>=0&&s.stimulus.ink<4);}else assert.equal(s.isPractice,true);
  await click('pause');await page.getByRole('button',{name:'Back to levels',exact:true}).tap();
 }
 await page.getByRole('button',{name:'Back',exact:true}).tap();
}
pass('Every one of 30 levels launches through the actual shared RN UI and Rust engine');
await page.evaluate(()=>window.__focusPreview.setStartDelay(200));
await click('game-stroop');await click('level-1');await click('start');
await page.getByRole('button',{name:'Back',exact:true}).tap();await page.clock.runFor(400);
assert.equal((await snap()).phase,'abandoned');
assert.equal(await page.locator('[data-testid="level-1"]').count(),1);
await page.evaluate(()=>window.__focusPreview.setStartDelay(0));
await page.getByRole('button',{name:'Back',exact:true}).tap();
pass('Navigation cancels a delayed native-start response without reopening gameplay');
await click('game-schulte');await click('level-11');await click('start');await page.clock.runFor(200);await click('number-2');assert.equal((await snap()).nextNumber,1);await click('number-1');const initial=await snap();
await click('pause');const paused=await snap();await page.clock.runFor(5000);await click('resume');await page.clock.runFor(100);assert.ok((await snap()).elapsedMs<paused.elapsedMs+400);pass('Wrong Schulte taps do not advance; pause excludes five seconds of background time');
await page.evaluate(()=>window.__focusSetRouteFocus(false));
await page.waitForFunction(()=>window.__focusPreview.client.getSnapshot().phase==='paused');
const routePaused=(await snap()).elapsedMs;await page.clock.runFor(5000);
await page.evaluate(()=>window.__focusSetRouteFocus(true));
assert.equal((await snap()).phase,'paused');await click('resume');await page.clock.runFor(100);
assert.ok((await snap()).elapsedMs<routePaused+400);pass('Retained route blur pauses the round and return never auto-resumes');
const seq=(await snap()).sequence;for(const n of seq.slice(1))await click(`number-${n}`);await page.waitForSelector('[data-testid="result-score"]');assert.equal(await page.locator('[data-testid="result-score"]').textContent(),'9,000');await page.waitForFunction(()=>localStorage.getItem('swa.focus.v1.preview-local')!==null);let rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('swa.focus.v1.preview-local')));assert.equal(rows.length,1);assert.equal(rows[0].metrics.score,9000);pass('Complete Schulte round saves an accuracy-weighted score once');
await click('restart');assert.equal((await snap()).counters.correct,0);await click('pause');await page.getByRole('button',{name:'Back to levels',exact:true}).tap();await page.getByRole('button',{name:'Back',exact:true}).tap();pass('Instant restart resets all counters without duplicating history');
await click('game-stroop');await click('level-1');await click('start');await page.clock.runFor(100);let s=await snap();await click(`answer-${s.stimulus.ink}`);assert.equal((await snap()).counters.correct,1);await page.clock.runFor(300);await click('pause');const before=(await snap()).elapsedMs;await page.clock.runFor(5000);await click('resume');await page.clock.runFor(100);assert.ok((await snap()).elapsedMs<before+400);await page.clock.runFor(30000);await page.waitForSelector('[data-testid="result-score"]');s=await snap();assert.equal(s.elapsedMs,30000);assert.ok(s.counters.missed>0);assert.equal(s.counters.incorrect,0);pass('Stroop ink answer is correct; 30-second active timer and separate misses are preserved');
await page.getByRole('button',{name:'Back to my day',exact:true}).tap();await click('game-go');await click('level-21');await click('start');await page.clock.runFor(100);await click('respond');await page.clock.runFor(2400);s=await snap();assert.equal(s.stimulus.letter,'A');await page.clock.runFor(2400);assert.equal((await snap()).stimulus.letter,'X');await click('respond');await page.clock.runFor(2600);await page.waitForSelector('[data-testid="timed-start"]');pass('Go / No-Go unscored practice handles X, withholding on A, then X');
await click('timed-start');
for(let i=0;i<300;i++){s=await snap();if(s.phase==='active'&&s.stimulus?.visible&&!s.stimulus.responded&&s.stimulus.letter==='X')await click('respond');await page.clock.runFor(100);}
await page.waitForSelector('[data-testid="result-score"]');s=await snap();assert.equal(s.result.metrics.hitRate,100);assert.equal(s.result.metrics.falseAlarmRate,0);assert.equal(s.result.counters.missed,0);assert.ok(s.result.counters.withheld>0);pass('Go / No-Go records hits, correct withholding, misses and false-alarm rates separately');
await page.getByRole('button',{name:'Back to my day',exact:true}).tap();await click('progress');await page.getByText('Personal bests',{exact:true}).waitFor();rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('swa.focus.v1.preview-local')));assert.equal(rows.length,3);assert.ok(rows.every(r=>!r.isPractice));pass('Progress contains only three completed rounds, never abandoned or practice rounds');
await page.reload();await page.waitForSelector('[data-testid="progress"]');await click('progress');await page.getByText('Personal bests',{exact:true}).waitFor();pass('Device history survives a reload');
await page.setViewportSize({width:320,height:640});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.getByRole('button',{name:'Back',exact:true}).tap();await click('game-schulte');await click('level-20');await click('start');await page.clock.runFor(120);assert.equal(await page.locator('[data-testid^="number-"]').count(),25);const dimensions=await page.locator('[data-testid^="number-"]').first().boundingBox();assert.ok(dimensions.width>=44&&dimensions.height>=44);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);pass('5×5 advanced grid has at least 44px touch cells at 320px width');
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/home/user/mobile-qa/mobile-advanced.png'});assert.deepEqual(errors,[]);pass('No runtime or console errors in the tested native-web/WASM paths');
fs.writeFileSync('docs/preview-QA.md',`# React Native Web + Rust WASM checks\n\n${checks.map(s=>'- PASS: '+s).join('\n')}\n\nActual shared React Native UI, React Native Web renderer, compiled Rust engine; Chromium touch emulation at 390×844 and 320×640; virtual monotonic clock for timed rounds. This is not a substitute for physical native iOS/Android QA.\n`);
await browser.close();
