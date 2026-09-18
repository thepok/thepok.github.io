/** Optional native extensions; the original complete physics remains the fallback. */
export async function loadCompatibleJolt(threads:number,optimized=true){
 if(optimized){
  try{
   if(threads>0){const init=(await import('./native/jolt-physics.multithread.wasm-compat.js')).default;return {J:await init(),threads,mode:'multithread' as const,core:'specialized-native'};}
   const init=(await import('./native/jolt-physics.wasm-compat.js')).default;return {J:await init(),threads:0,mode:'single-thread' as const,core:'specialized-native'};
  }catch(error){console.warn('Specialized physics unavailable; retaining the original game physics.',error);}
 }
 if(threads>0){try{const init=(await import('jolt-physics/wasm-compat-multithread')).default;return {J:await init(),threads,mode:'multithread' as const,core:'original'};}catch(error){console.warn('Multithread physics unavailable; using original single-thread fallback.',error);}}
 const init=(await import('jolt-physics')).default;return {J:await init(),threads:0,mode:'single-thread' as const,core:'original'};
}
