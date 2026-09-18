// Finish static-host isolation before loading the renderer or physics workers.
declare const __BUILD_VERSION__: string;
async function boot() {
  const status=(text:string)=>{const el=document.getElementById('boot-status');if(el)el.textContent=text;};
  status('Mehrkern-Physik wird eingerichtet …');
  if ('serviceWorker' in navigator && isSecureContext) {
    try {
      const scriptURL = new URL(`isolation-sw.js?v=${__BUILD_VERSION__}`, document.baseURI);
      const registration=await navigator.serviceWorker.register(scriptURL,
        { scope: new URL('./', document.baseURI).pathname, updateViaCache: 'none' });
      if (!crossOriginIsolated) {
      // A hard refresh bypasses the existing worker for this document. Re-registering
      // an already active worker does not activate it again, so explicitly reclaim
      // this client before doing the ordinary reload that supplies isolation headers.
      registration.active?.postMessage({type:'loadbearing-claim'});
      await Promise.race([
        new Promise<void>(resolve => {
          if (navigator.serviceWorker.controller?.scriptURL === scriptURL.href) return resolve();
          navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
        }),
        new Promise<void>(resolve => setTimeout(resolve, 8000)),
      ]);
      if (navigator.serviceWorker.controller && new URL(location.href).searchParams.get('lb-isolation')!==__BUILD_VERSION__) {
        const reloadURL=new URL(location.href);reloadURL.searchParams.set('lb-isolation',__BUILD_VERSION__);
        location.replace(reloadURL.href);
        return;
      }
      }
    } catch (error) { console.warn('Static-host isolation unavailable; using compatible physics.', error); }
  }
  if (crossOriginIsolated) {
    sessionStorage.removeItem('loadbearing.isolation-reload');
    const cleanURL=new URL(location.href);if(cleanURL.searchParams.has('lb-isolation')){cleanURL.searchParams.delete('lb-isolation');history.replaceState(history.state,'',cleanURL.href);}
  }
  status('Spielpaket wird geladen …');
  const main=await import('./main');
  status('Grafik und Spielwelt werden vorbereitet …');
  await main.startupReady;
  document.getElementById('boot-screen')?.remove();
}
void boot().catch(error=>{console.error('Game startup failed',error);document.getElementById('boot-status')!.textContent='Das Spiel konnte nicht gestartet werden.';document.getElementById('boot-note')!.textContent='Bitte prüfe die Verbindung und lade das Spiel erneut.';const retry=document.getElementById('boot-retry')!;retry.hidden=false;retry.onclick=()=>location.reload();});
