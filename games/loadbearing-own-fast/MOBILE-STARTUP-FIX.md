# Mobile benchmark progress fix

The benchmark previously looked frozen at zero while its 1,000-part test
building was being preloaded. That preparation happens before measured scenario
time, so the old display was technically zero but operationally misleading.

It now reports three separate stages:
1. Gebäude vorspannen: preparation steps are shown immediately.
2. Aufwärmen: warmup steps are shown separately.
3. Messen: only this stage is labelled as simulated seconds.

The large-building preload was also reduced safely. The generated-building
regression set settled in at most 70
steps; every tested case reached the quiet criterion and no connection broke
during startup.

On the deliberately slow Android-style test profile, benchmark progress first
became visible after 772 ms with status:
Referenz · Paar 1/1 · Gebäude vorspannen · 2/120 Schritte

The normal 1,000-part game reached live scenario time after 8822 ms
on that same throttled profile.

This is a regression result, not a guarantee for every phone.
