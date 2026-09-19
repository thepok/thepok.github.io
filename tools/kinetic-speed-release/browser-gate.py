"""Correct the live-test contract: the original terrain includes physical trees.
These are deliberately retained and reported as an uncontrolled-world difference;
the dedicated A/B worker is the controlled performance comparison.
"""
from pathlib import Path
import sys
root=Path(sys.argv[1]);p=root/'tests/speed-browser.mjs';s=p.read_text()
old='assert.equal(live.controlled,true);'
assert s.count(old)==1
s=s.replace(old,"assert.equal(live.controlled,live.interventions.length===0);assert.ok(live.interventions.every(kind=>kind==='trees-present'),'Unexpected intervention: '+live.interventions.join(','));assert.equal(live.internalSubsteps,variant==='reference'?2400:1200);")
old='report.runs.push({variant,live});';assert s.count(old)==1
s=s.replace(old,'')
old='assert.equal(live.ticks,1200);';assert s.count(old)==1
s=s.replace(old,'report.runs.push({variant,live});'+old)
p.write_text(s)
print('Live renderer test retains ambient trees and validates honest intervention reporting; controlled A/B unchanged.')
