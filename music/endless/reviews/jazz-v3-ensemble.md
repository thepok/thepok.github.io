# Ensemble review of composition-v3

Compared twelve matched seeds: banks 0, 1, 2, 3, 4, 6, 10, 13, 17, 23, 40, 47. Evidence is actual compiled notes, source, phrase/landmark records, and controlled counterfactual recompilation. Same Hero sound configuration is a constraint; this review recommends no timbre, mic or generic-humanization changes. No human listening or professional-recording audio A/B is claimed.

## Final ensemble verdict (round 6)

The corrected version addresses the specific ensemble deficiencies rather than merely adding random activity. It provides actual phrase-dependent replies, protected shared spaces, proper four-bar trading and cadence-directed drum gestures. These are substantive changes that can plausibly improve conversational character. They do not establish that listeners will find every song compelling, or that the system has reached professional artistry.

A serious first-round regression was detected and corrected: passing an entire prior solo into a short response compressed dozens of notes into an unplayable burst. The final bounded-utterance design matters musically as well as technically: remember a singable cell, not a whole section sped up to fit.

## Before and after, with concrete evidence

### Real response and selective coordination

Previously, removing two thirds of one sax solo changed only sax/comp. Bass, drums and the next piano melody remained identical. Stable timekeeping itself was not a defect; there was no mechanism to make selective exceptions based on a phrase's meaning.

The new protected-space counterfactual holds seed, harmony, arrangement and all unrelated sections constant. In bank 0, **A Postcard for Grove**, the piano solo starts at **133.33 s**. Filling its selected written gap moves the planned shared space from relative beats **15–17.5** to **25.5–27.5**. Piano RH/LH, bass and drums now change within that section; every note outside it remains exactly identical. Sax is unchanged. This is a narrow causal response, not global random regeneration. Evidence: `ensemble-causal.json`.

A separate response test changes the actual question rhythm under the same answer harmony and response mode. The returned answer changes accordingly. Its dependency is no longer merely the old head motif plus a new seed.

In all 12 final round-6 outputs, both selected protected gaps contain **zero compiled note attacks in their interiors across all five tracks**, allowing 0.15 beat at boundaries for normal groove/layback. This checks actual performed notes, not just metadata. It does not mean acoustically dead silence: natural note releases and room tails remain appropriate.

### Trading geometry and cadential meaning

Bank 6, **Leroy Snowfall**, previously had a four-bar sax question followed by twelve bars of piano. It now takes the last eight bars of the chosen chart, preserving its destination, and splits them into four plus four: **90.57 s sax / 95.09 s piano**. Banks 0 and 13 in the matched sample also have exact 4+4, and their `response_to` records match the actual question notes. Source logic is meter-aware and does not prefix-truncate a twelve- or sixteen-bar chart.

Asymmetry remains a legitimate future expressive option. The improvement is making it intentional instead of accidentally assigning the leftover chart to the answering player.

### Form-aware drums and more definite bossa

Periodic eight-bar fills no longer override the chart's actual phrase endings. Bank 2, **Hudson Kettle Blues**, previously inserted a triplet fill in bar eight of its twelve-bar solo while leaving the turnaround unmarked. The new second solo starts at **83.48 s** and plans its fill at relative beats **45.5–48**, the final turnaround bar and the lead's written breath. Stable time continues elsewhere.

Bossa now has a deliberate repeating two-bar relationship of brush taps, foot-hat and feathered kick instead of the generic straight-brush backbeat with incidental fill kicks. Repetition is valuable here: a consistent groove identity is preferable to random per-bar novelty. The current pattern is still one narrow grammar rather than a broad professional bossa vocabulary.

### Phrase memory stays singable

Bank 47, **A Snowfall for Bedford**, exposed the round-1 defect: original sax 213 notes, candidate 605 notes, peak two-second density **4 → 25 notes/second**, and 322 inter-onset intervals below 60 ms. The candidate had squeezed 50 remembered notes into six beats.

After selecting the final breath-separated cell (at most two bars/eight notes) and forbidding response time compression, its final version has 230 sax notes and peak **5 notes/second**. Across all twelve final outputs, sax peak two-second density is at most **5 notes/second**. This is a regression guard, not a musical merit score: virtuosic jazz can exceed it deliberately, and a boring phrase can remain below it.

## Remaining artistic limits

- Every inspected song still receives the same broad idea of a protected head landmark plus a protected second-solo landmark. Their locations depend on actual phrases, but this is a small arrangement vocabulary. Do not confuse two coordinated silences with mature ensemble improvisation.
- The reply transformations remain a small family of contour/rhythm operations. A causally dependent reply can still feel mechanical. Blind full-song comparisons should ask whether the listener actually recognizes the conversation without reading section names.
- The bossa grammar is more definite, while shuffle remains close to the common swung brush vocabulary. These are stylistic refinements to prioritize later, not reasons to replace coherent timekeeping with more fills.
- Harmonic pacing, memorable head identity and the credibility of the overall climax require the separate composition review and listening judgments. More varied event counts do not settle them.

## Final verification

The pianist-ornament mismatch found in round 3 is corrected: in the final round-6 matched set, **all 41 planned cadence-fill windows have zero lead attacks in their interiors** (same 0.15-beat boundary tolerance). Both previously affected ballads now honor the selected lead breath. LH accompaniment may still support the cadence deliberately; this is not a requirement for every voice to stop during every fill.

Re-ran the causal counterfactual on final source: the selected gap still relocates, the four relevant tracks change only inside that solo, all outside notes stay identical, and changing the actual question changes its reply. All 24 shared-gap interiors remain clear. Actual sampled trading segments remain 4+4 and retain the question provenance. The twelve-song density guard is clear after later theme-memory refinements as well.

No remaining ensemble implementation blocker found for this candidate. Recommend the candidate for whole-song listening comparison and the parent technical/browser checks. The conclusions are stronger than “more diversity in metadata,” but still do not certify professional artistic impact.

Reviewed `jazz_web.py` SHA-256: `4e9379f3a7086623f3cd8926ccc8741b2c48eaa88cb1c09e381c5e41d6921b50`.
