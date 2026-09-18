import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const root=resolve('dist'), prefix='/games/loadbearing/';
const server=process.env.TEST_URL?null:createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(!pathname.startsWith(prefix)){res.writeHead(404).end();return;}
  const file=resolve(root,pathname.slice(prefix.length)||'index.html');
  if(!file.startsWith(root)){res.writeHead(403).end();return;}
  try{const data=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}
});
if(server)await new Promise(r=>server.listen(5185,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1155/chrome-win/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1536,height:960}}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(process.env.TEST_URL||`http://127.0.0.1:5185${prefix}`);
 await page.waitForFunction(()=>window.__loadBearing?.ready,{},{timeout:60000});
 const isolation=await page.evaluate(()=>({isolated:crossOriginIsolated,controller:navigator.serviceWorker.controller?.scriptURL}));
 assert.equal(isolation.isolated,true);assert.equal(new URL(isolation.controller).pathname,prefix+'isolation-sw.js');assert.ok(new URL(isolation.controller).searchParams.has('v'));
 const version=await page.locator('meta[name=build-version]').getAttribute('content');assert.ok(version);assert.ok((await page.locator('script[type=module]').getAttribute('src')).endsWith('?v='+version));
 await page.click('#workshop-mode');await page.click('#sandbox-mode');
 await page.locator('#fragment-limit').fill('3000');await page.locator('#fragment-limit').dispatchEvent('input');await page.click('#save');
 const saves=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('loadbearing.'))));
 assert.equal(saves['loadbearing.fragment-limit'],'3000');
 await page.click('#run');await page.waitForFunction(()=>window.__loadBearing.simulation?.mode==='multithread',{},{timeout:60000});
 const physics=await page.evaluate(()=>({mode:window.__loadBearing.simulation.mode,threads:window.__loadBearing.simulation.threads}));assert.ok(physics.threads>0);
 await page.waitForFunction(()=>window.__loadBearing.simulation.elapsed>0.5);
 await page.screenshot({path:'artifacts/static-host.png'});
 const reloadResponse=await page.reload();assert.match(reloadResponse.headers()['cache-control'],/no-store/);await page.waitForFunction(()=>window.__loadBearing?.ready,{},{timeout:60000});
 assert.equal(await page.evaluate(()=>localStorage.getItem('loadbearing.fragment-limit')),'3000');
 assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.startsWith('loadbearing.')))),saves);
 assert.deepEqual(errors,[]);console.log('PASS static nested host, isolation, multithread simulation and persistent browser saves',isolation,physics);
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));}
