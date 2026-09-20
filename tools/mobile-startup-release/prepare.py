from pathlib import Path
import json, shutil, zipfile
baseline=Path('games/loadbearing-own-fast')
tested=Path('validated')
out=Path('/tmp/loadbearing-own-fast-mobile')
shutil.copytree(baseline,out,dirs_exist_ok=True)
shutil.copytree(tested/'dist',out,dirs_exist_ok=True)
evidence=tested/'artifacts/mobile-startup'
shutil.copytree(evidence,out/'evidence/mobile-startup',dirs_exist_ok=True)
progress=json.loads((evidence/'mobile-progress.json').read_text())
startup=[json.loads(line) for line in (evidence/'startup-generated.log').read_text().splitlines() if line.startswith('{')]
assert startup and all(row['quiet'] and row['broken']==0 for row in startup)
assert all(row['settleSteps']<=75 for row in startup)
moved=next(row for row in progress['benchmarkProgress'] if row['value']>.1)
final=progress['gameProgress'][-1]
assert final['elapsed']>.5
build=json.loads((baseline/'BUILD.json').read_text())
build['mobileProgressFix']={
 'validationRun':35501533179,
 'validatedHead':'51d83369109f94d321455910c005bba53f922326',
 'codeChangeCommit':'139d3adae7c6ef3e8be0a8ab91ee797339843f81',
 'benchmarkFirstVisibleProgressMs':moved['wallMs'],
 'benchmarkFirstVisibleStatus':moved['status'],
 'throttledGameStartMs':final['wallMs'],
 'generatedRegressionCount':len(startup),
 'generatedMaxSettleSteps':max(row['settleSteps'] for row in startup),
 'generatedAllQuiet':all(row['quiet'] for row in startup),
 'generatedStartupBreaks':sum(row['broken'] for row in startup),
 'profile':'Android-style Chromium, 412x915, touch, 4 logical cores, 4x CPU throttle'
}
(out/'BUILD.json').write_text(json.dumps(build,indent=2)+'\n')
note=f"""# Mobile benchmark progress fix

The benchmark previously looked frozen at zero while its 1,000-part test
building was being preloaded. That preparation happens before measured scenario
time, so the old display was technically zero but operationally misleading.

It now reports three separate stages:
1. Gebäude vorspannen: preparation steps are shown immediately.
2. Aufwärmen: warmup steps are shown separately.
3. Messen: only this stage is labelled as simulated seconds.

The large-building preload was also reduced safely. The generated-building
regression set settled in at most {max(row['settleSteps'] for row in startup)}
steps; every tested case reached the quiet criterion and no connection broke
during startup.

On the deliberately slow Android-style test profile, benchmark progress first
became visible after {moved['wallMs']} ms with status:
{moved['status']}

The normal 1,000-part game reached live scenario time after {final['wallMs']} ms
on that same throttled profile.

This is a regression result, not a guarantee for every phone.
"""
(out/'MOBILE-STARTUP-FIX.md').write_text(note)
with zipfile.ZipFile(out/'source.zip','w',zipfile.ZIP_DEFLATED) as z:
 for part in ['src','tests','public']:
  for p in (tested/part).rglob('*'):
   if p.is_file(): z.write(p,p.relative_to(tested))
 for name in ['package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html']:
  z.write(tested/name,name)
 z.writestr('MOBILE-STARTUP-FIX.md',note)
 z.writestr('BUILD.json',json.dumps(build,indent=2)+'\n')
print(json.dumps(build['mobileProgressFix'],indent=2))
