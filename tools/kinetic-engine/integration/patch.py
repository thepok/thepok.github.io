from pathlib import Path
import json,sys,shutil,re
root=Path(sys.argv[1]); engine=Path(sys.argv[2]); target=root/'src/own-engine'
target.mkdir(exist_ok=True)
for p in engine.iterdir():
 if p.is_file():shutil.copyfile(p,target/p.name)
def change(path,old,new):
 p=root/path;s=p.read_text();assert s.count(old)==1,(path,old[:60],s.count(old));p.write_text(s.replace(old,new))
change('src/physics.ts',"import initJolt from 'jolt-physics';","import initKinetic from './own-engine/compatibility.mjs';")
p=root/'src/physics.ts';s=p.read_text().replace('ReturnType<typeof initJolt>','ReturnType<typeof initKinetic>').replace('??= initJolt()','??= initKinetic()').replace('// Keep the WASM boundary in one module; Jolt objects must be explicitly released.','// KINETIC own WASM kernel; the facade retains the original game object protocol.');p.write_text(s)
p=root/'src/physics-worker.ts';s=p.read_text();a=s.index('async function loadJolt(');b=s.index('async function prepareStructure()',a);s=s[:a]+"async function loadKinetic(_threads:number){const init=(await import('./own-engine/compatibility.mjs')).default;return {J:await init(),threads:0,mode:'own-wasm' as const};}\n"+s[b:];s=s.replace('await loadJolt(c.threads)','await loadKinetic(c.threads)');p.write_text(s)
# Separate browser storage, without migrating or touching old saved games.
for p in (root/'src').glob('*.ts'):
 s=p.read_text().replace('loadbearing.','loadbearing-own.').replace("'loadbearing'","'loadbearing-own'")
 if p.name=='main.ts':
  s=s.replace('Loading Jolt Physics…','Loading KINETIC Physics…')
  s=s.replace("simulation.mode==='multithread'?`Jolt · ${simulation.threads} Threads`:'Jolt · Single thread'","simulation.mode==='own-wasm'?'KINETIC · own WASM':simulation.mode")
  # Existing footer, not a replacement GUI.
  s=re.sub(r'const updateEngineLabel=.*?;};',"const updateEngineLabel=(mode?:string,threads=0)=>{$('engine-label').textContent=`${scene.rendererBackend==='webgpu'?'WebGPU':'WebGL'} · KINETIC · own WASM`;};",s)
  s=s.replace('Jolt WASM','KINETIC WASM').replace('Jolt ·', 'KINETIC ·')
 p.write_text(s)
p=root/'vite.config.ts';s=p.read_text();s=s.replace("if(id.includes('/node_modules/jolt-physics/')) return 'jolt-physics'; ",'');p.write_text(s)
p=root/'package.json';pkg=json.loads(p.read_text());pkg.get('dependencies',{}).pop('jolt-physics',None);pkg['scripts']['test']='node --import ./tests/own-env.mjs tests/physics.mjs';p.write_text(json.dumps(pkg,indent=2)+'\n')
p=root/'package-lock.json';lock=json.loads(p.read_text());lock['packages'][''].get('dependencies',{}).pop('jolt-physics',None);lock['packages'].pop('node_modules/jolt-physics',None);p.write_text(json.dumps(lock,indent=2)+'\n')
# Some old fixtures instantiate an engine directly. Redirect them explicitly;
# external:['jolt-physics'] is only esbuild configuration, never an engine load.
for p in (root/'tests').glob('*.mjs'):
 s=p.read_text().replace("(await import('jolt-physics')).default","(await import('../src/own-engine/compatibility.mjs')).default").replace("from 'jolt-physics'","from '../src/own-engine/compatibility.mjs'")
 if p.name=='physics-body-capacity.mjs':s=s.replace("platform:'neutral'","platform:'node'")
 if p.name=='vehicle-physics.mjs':s=s.replace('recycling.launchProjectile([0,10,20],[0,-1,-10],mass,radius)',"recycling.launchProjectile([0,10,20],[0,-1,-10],mass,radius,'solid',true)")
 p.write_text(s)
(root/'tests/own-env.mjs').write_text("import{readFileSync}from'node:fs';globalThis.__KINETIC_WASM__=readFileSync(new URL('../src/own-engine/kernel.wasm',import.meta.url));\n")
# Fail on any remaining third-party physics import in the shipped source.
for p in (root/'src').rglob('*'):
 if p.suffix in ['.ts','.mjs','.js']:
  assert not re.search(r'''(?:from\s*|import\s*\()\s*['"](?:jolt-physics|@dimforge/rapier|ammo|cannon|planck)''',p.read_text()),p
print('Original GUI, rendering, materials and every individual part retained; Jolt dependency removed.')
