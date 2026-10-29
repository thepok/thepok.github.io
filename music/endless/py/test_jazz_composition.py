"""Behavioral musical contracts: memory provenance, real answers and preserved legacy recipes."""
import os,sys,unittest,json,gzip,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
MIRROR=Path(os.environ['AGENTSOUND_WEB_REPO'])
sys.dont_write_bytecode=True
os.environ['AGENTSOUND_ASSETS']=str(MIRROR/'assets')
os.environ['AGENTSOUND_SAMPLES']=str(MIRROR/'assets/samples')
sys.path.insert(0,str(MIRROR))
import compose_web as web
import jazz_web as q
from agentsound import Clip

class CompositionTests(unittest.TestCase):
    def test_long_solo_is_not_compressed_into_response(self):
        long=Clip([(i*.5,.38,60+i%12,85) for i in range(160)],length=80)
        prog=q._prog([('Dm7',8)],'C major',4)
        answer=q.response(long,prog,'C major',8,(57,80))
        self.assertLessEqual(len(answer),8)
        self.assertTrue(all(b.start-a.start>=.49 for a,b in zip(answer,list(answer)[1:])))
        self.assertLessEqual(max(n.start+n.dur for n in answer),7.5)
        self.assertEqual(len(long),160)  # extraction does not rewrite the question

    def test_answer_hears_question(self):
        a=Clip([(.5,.5,64,80),(1.5,.5,67,80),(2.5,1,65,80)],length=8)
        b=Clip([(.5,.5,71,80),(2,.5,62,80),(3,1,69,80)],length=8)
        prog=q._prog([('Dm7',4),('G7',4)],'C major',4)
        aa=list(q.response(a,prog,'C major',8,(60,88)))
        bb=list(q.response(b,prog,'C major',8,(60,88)))
        self.assertNotEqual([n.pitch for n in aa],[n.pitch for n in bb])
        self.assertNotEqual([n.start for n in aa],[n.start for n in bb])

    def test_short_solo_develops_actual_previous_phrase(self):
        motif=Clip([(.5,.5,64,80),(1.5,.5,67,80),(2.5,1,65,80)],length=8)
        arguments=([('Dm7',8),('G7',8)],'C major',4,12,motif,'sax')
        a,_,audit_a=q.solo_story(*arguments,'space',.6)
        b,_,audit_b=q.solo_story(*arguments,'answer',.6)
        self.assertEqual(audit_a[0]['notes'],audit_b[0]['notes'])
        self.assertNotEqual(audit_a[1]['notes'],audit_b[1]['notes'])
        first=Clip([tuple(n) for n in audit_a[0]['notes']],length=8)
        self.assertEqual(audit_a[1]['source'],[list(n) for n in q.utterance(first,4)])

    def test_native_head_sax_transfer_preserves_attacks(self):
        source=Clip([(19,3,69,80),(20,3,72,80)],length=32)
        line=list(q.sax_line(source))
        self.assertEqual([(n.start,n.pitch) for n in line],[(19,69),(20,72)])
        self.assertEqual([n.dur for n in line],[1,3])
        self.assertEqual([n.dur for n in source],[3,3])

    def test_legacy_default_hero_recipes_unchanged(self):
        for i in [0,1,6]:
            data=subprocess.check_output(['git','-C',str(ROOT),'show',f'498d071b:music/endless/bank/jazz/{i}.json.gz'])
            old=json.loads(gzip.decompress(data))
            self.assertEqual(old['recipe']['slot']['quartet'],'quartet-2')
            self.assertEqual(web.compose_recipe(old['recipe'])['hash'],old['hash'])

if __name__=='__main__':unittest.main()
