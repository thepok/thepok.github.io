const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const sampleZones = vm.runInNewContext(source.slice(source.indexOf('function* sampleZones('), source.indexOf("// the piece's samples, loaded on demand:")) + '\nsampleZones;');
const sax = {type:'stack', params:{layers:[
  {instrument:{type:'sampler',params:{samples:[{file:'samples/weresax/A.wav'}, {file:'*noise'}]}}},
  {instrument:{type:'stack',params:{layers:[{instrument:{type:'sampler',params:{samples:[{file:'samples/weresax/B.wav'}]}}}]}}},
  {instrument:{type:'oscillator',params:{}}},
]}};
const zones=[...sampleZones(sax)];
assert.deepEqual(zones.map(x=>x.file), ['samples/weresax/A.wav','samples/weresax/B.wav']);
zones[0].file='s/sax-A.wav';
assert.equal(sax.params.layers[0].instrument.params.samples[0].file,'s/sax-A.wav','Loader must rewrite the actual nested instrument');
assert.equal(sax.params.layers[0].instrument.params.samples[1].file,'*noise','Oscillator sources stay in the engine');
assert.equal([...sampleZones({params:{samples:[{file:'piano.wav'}]}})].length,1);
assert.equal([...sampleZones({type:'sampler',params:{layers:'dynamics',samples:[{file:'horn.wav'}]}})].length,1);
console.log('PASS: nested Hero Sax sample routing and oscillator preservation');
