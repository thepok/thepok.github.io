"""Diagnostic-only corrections after native benchmark validation.
The kernel, gameplay physics, data and numerical policy are not modified.
"""
from pathlib import Path
import sys
root=Path(sys.argv[1])
def replace(path,old,new):
 p=root/path;s=p.read_text();assert s.count(old)==1,(path,s.count(old));p.write_text(s.replace(old,new))
replace('src/benchmark/suite.ts',' step(){\n  // Includes projectile creation',' step(){\n  if(this.tick===0)this.initialSubsteps=this.sim.world.k?.substeps_total?.()??0;\n  // Includes projectile creation')
p=root/'src/benchmark/ui.css';p.write_text(p.read_text()+'\n/* The existing toolbar hides text at tablet widths; this button has no icon. */\n#kinetic-benchmark span{display:inline!important}\n')
replace('src/benchmark/ui.ts','restore:(()=>void)|undefined,busy=false;','restore:(()=>void)|undefined,busy=false,operation=0;')
replace('src/benchmark/ui.ts','function finish(){worker?.terminate();','function finish(){operation++;worker?.terminate();')
replace('src/benchmark/ui.ts',"if(busy)return;controls(true);$('kb-result').hidden=true;","if(busy)return;const request=++operation;controls(true);(window as any).__kineticBenchmark=undefined;$('kb-result').hidden=true;")
replace('src/benchmark/ui.ts','if(!busy)return;scene.render=()=>{};','if(!busy||operation!==request)return;scene.render=()=>{};')
replace('src/benchmark/ui.ts',"}catch(e){finish();status(e instanceof Error?e.message:String(e));}\n };","}catch(e){if(operation===request){finish();status(e instanceof Error?e.message:String(e));}}\n };")
print('Corrected diagnostic substep accounting and benchmark lifecycle; physics unchanged.')
