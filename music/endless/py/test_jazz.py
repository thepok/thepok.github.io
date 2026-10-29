"""Quartet musical contracts. Run with AGENTSOUND_WEB_REPO pointing to extracted browser archive."""
import os
import sys
import unittest
from collections import Counter
sys.path.insert(0,os.environ['AGENTSOUND_WEB_REPO'])
import compose_web as web
import jazz_web as quartet
from agentsound import Clip

class QuartetTests(unittest.TestCase):
    def test_bank_openings_have_variety(self):
        plans=[quartet.plan_set(910000+i*997)[0] for i in range(48)]
        self.assertEqual(len({p['feel'] for p in plans}),5)
        self.assertGreaterEqual(len({p['layout'] for p in plans}),4)
        self.assertEqual(len({p['form'] for p in plans}),3)
        for seed in range(20):
            plan=quartet.plan_set(seed)
            self.assertEqual(Counter(p['feel'] for p in plan),Counter(['straight','straight','shuffle','bossa','ballad','waltz']))
            self.assertTrue(all(a['feel']!=b['feel'] for a,b in zip(plan,plan[1:])))

    def test_wide_range_preserves_contour(self):
        source=Clip([(i,.5,p,90) for i,p in enumerate([40,48,60,72,90,72,60,48,40])],length=9)
        fitted=list(quartet._fit(source,57,80))
        self.assertTrue(all(57<=n.pitch<=80 for n in fitted))
        self.assertEqual([n.pitch for n in fitted[:5]],sorted(n.pitch for n in fitted[:5]))
        self.assertEqual([n.pitch for n in fitted[4:]],sorted((n.pitch for n in fitted[4:]),reverse=True))

    def test_recipe_and_bank_resume(self):
        session=web.Session('jazz',182)
        first=session.next()
        second=session.next()
        replay=web.compose_recipe(second['recipe'])
        self.assertEqual(second['hash'],replay['hash'])
        resumed=web.Session('jazz',182)
        resumed.skip_first(first['info']['key'])
        self.assertEqual(second['hash'],resumed.next()['hash'])
        self.assertFalse(first['info'].get('web_missing'))
        self.assertFalse(second['info'].get('web_missing'))

if __name__=='__main__':unittest.main()
