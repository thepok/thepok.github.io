const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const timers = [], errors = [];
const MseStream = vm.runInNewContext(source.slice(source.indexOf('class MseStream {'), source.indexOf('\nlet stream = null;')) + '\nMseStream;', {
  performance: { now: () => 20000 }, setTimeout: f => timers.push(f), reportError: e => errors.push(e),
});
function make(time, ranges = []) {
  const s = Object.create(MseStream.prototype);
  Object.assign(s, {audio: {currentTime: time}, ms: {readyState: 'open'}, full: 0, lastEvict: 0,
    ops: [{kind: 'append', data: new Uint8Array([1])}], attempts: 0, removed: []});
  s.sb = {updating: false, buffered: {length: ranges.length, start: i => ranges[i][0], end: i => ranges[i][1]},
    appendBuffer() { s.attempts++; if (!s.accept) throw Object.assign(new Error('Buffer full'), {name: 'QuotaExceededError'}); this.updating = true; },
    remove(a,b) { s.removed.push([a,b]); this.updating = true; }};
  return s;
}
// A full buffer with nothing old enough to evict must yield, not recurse.
let s = make(0);
s.run();
assert.equal(s.attempts, 1);
assert.equal(s.ops.length, 1);
assert.equal(timers.length, 1);
for (let i=0;i<100;i++) s.run();
assert.equal(s.attempts, 1);
s.accept = true;
timers.shift()();
assert.equal(s.attempts, 2);
assert.equal(s.sb.updating, true);
// Eviction precedes the original append, which remains queued until retry.
s = make(60, [[0, 100]]);
s.run();
assert.deepEqual(s.removed, [[0,40]]);
assert.equal(s.ops[0].kind, 'remove');
s.sb.updating=false; s.ops.shift(); s.run();
assert.equal(s.attempts,1);
s.accept=true; timers.shift()();
assert.equal(s.attempts,2);
// Many empty removals are processed without recursive stack growth.
s = make(0);
s.ops = Array.from({length: 20000}, () => ({kind:'remove',a:0,b:0}));
s.run();
assert.equal(s.ops.length,0);
assert.deepEqual(errors, []);
console.log('PASS: quota backpressure, delayed retry, eviction ordering, long no-op queue');
