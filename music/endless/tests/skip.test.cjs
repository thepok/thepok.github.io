const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
const MseStream = vm.runInNewContext(source.slice(source.indexOf('class MseStream {'), source.indexOf('\nlet stream = null;'))+'\nMseStream;', {
  performance:{now:()=>0}, enough:()=>true, AHEAD_BYTES:9e6,
});
const s=Object.create(MseStream.prototype);
const piece={store:{packets:[{ts:0,dur:20000,d:new Uint8Array([1])}],cfg:null,complete:false}};
let ranges=[];
Object.assign(s,{audio:{currentTime:10},sb:{buffered:{get length(){return ranges.length},start:i=>ranges[i][0],end:i=>ranges[i][1]}},
  end:12,full:0,segs:[],evict(){},append(list,cfg,segment){this.enqueued=segment},ops:[]});
const seg=s.newSeg(piece,0);seg.seekTo=0;
s.pump([piece]);
assert.equal(s.audio.currentTime,10,'Do not seek into data still waiting to be appended');
assert.equal(seg.seekTo,0,'Keep requested position until append completes');
assert.equal(s.enqueued,seg);
ranges=[[12,13]];s.finishSeek(seg);
assert.equal(s.audio.currentTime,12);
assert.equal(seg.seekTo,undefined);
const old={base:20,seekTo:0};s.segs=[seg];s.finishSeek(old);
assert.equal(s.audio.currentTime,12,'A completed append from an earlier skip must not seek');
// A prequeued next piece may have timestamps but no committed audio yet.
const future={piece:{info:{seconds:10}},base:20,from:0,done:false};
const previous={piece:{},base:0,done:true,endT:10};
s.segs=[previous,future];s.end=30;s.audio.currentTime=2;ranges=[[0,10]];
const MsePlayer=vm.runInNewContext(source.slice(source.indexOf('class MsePlayer {'),source.indexOf('\n// the clock the transport'))+'\nMsePlayer;',{stream:s,state:{playing:false},GAP:2.5});
new MsePlayer(future.piece,0);
assert.equal(s.audio.currentTime,2,'Prequeued timestamps are not proof the next audio is buffered');
assert.equal(future.seekTo,0);
ranges.push([20,30]);s.finishSeek(future);
assert.equal(s.audio.currentTime,20);
new MsePlayer(future.piece,2);
assert.equal(s.audio.currentTime,22,'Seeking within committed audio remains immediate');
// An empty pool must reserve a new current piece rather than leaving playback null.
const ctx={current:{id:1},played:[],KEEP:2,pool:[],bankIndex:null,state:{piano:'beste',genre:'new-age',gen:1},renderQueue:[],next:2,
  freePiece(){},canPlay:()=>false,newPiece(kind,extra){return {id:this.next++,kind,...extra}},
  bankPiece:()=>Promise.resolve({e:{}}),adopt(){},pumpWork(){},reportError(e){throw Error(e)},
};
ctx.newPiece=(kind,extra)=>({id:ctx.next++,kind,...extra});ctx.setCurrent=p=>{ctx.current=p};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('function advance('),source.indexOf("\n$('play').onclick"))+'\nadvance();',ctx);
assert.ok(ctx.current,'Empty pool must retain a selected destination');
assert.equal(ctx.current.kind,'bank');
vm.runInContext('advance(); advance();',ctx);
assert.ok(ctx.current,'Repeated skips must still have a destination');
Promise.resolve().then(()=>{assert.equal(ctx.current.status,'queued');console.log('PASS: deferred seek, stale append isolation, repeated empty-pool skips');});
