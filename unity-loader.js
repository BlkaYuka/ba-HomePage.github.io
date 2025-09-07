// Tries to load Unity WebGL build based on unity/config.json
// If missing or failing, falls back to the JS canvas game.

(function(){
  const unityCard = document.getElementById('unity-card');
  const fallbackCard = document.getElementById('fallback-card');
  const canvas = document.getElementById('unity-canvas');
  const progress = document.getElementById('unity-progress');
  const status = document.getElementById('unity-status');

  function setStatus(text){ if (status) status.textContent = text; }
  function showFallback(){
    if (unityCard) unityCard.hidden = true;
    if (fallbackCard) fallbackCard.hidden = false;
    // Lazy-load the fallback game only if needed
    const s = document.createElement('script');
    s.src = './game.js';
    document.body.appendChild(s);
  }

  async function loadConfig(){
    try {
      const res = await fetch('./unity/config.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('config not found');
      return await res.json();
    } catch (e) {
      throw new Error('Unity config missing');
    }
  }

  function injectScript(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  async function boot(){
    try {
      setStatus('설정 파일 확인 중…');
      const cfg = await loadConfig();
      const base = './unity';
      const build = `${base}/${cfg.buildFolder || 'Build'}`;
      const loaderUrl = `${build}/${cfg.loaderFile || 'Build.loader.js'}`;

      setStatus('로더 불러오는 중…');
      await injectScript(loaderUrl);
      if (typeof createUnityInstance !== 'function') throw new Error('loader missing createUnityInstance');

      setStatus('초기화 중…');
      const unityConfig = {
        dataUrl: `${build}/${cfg.dataUrl || 'Build.data'}`,
        frameworkUrl: `${build}/${cfg.frameworkUrl || 'Build.framework.js'}`,
        codeUrl: `${build}/${cfg.codeUrl || 'Build.wasm'}`,
        streamingAssetsUrl: `${base}/${cfg.streamingAssetsUrl || 'StreamingAssets'}`,
        companyName: cfg.companyName || 'Company',
        productName: cfg.productName || 'UnityGame',
        productVersion: cfg.productVersion || '1.0',
        decompressionFallback: cfg.decompressionFallback !== false,
      };

      createUnityInstance(canvas, unityConfig, (p)=>{
        if (progress) progress.value = p;
        setStatus(`로딩 ${Math.round(p*100)}%`);
      }).then((instance)=>{
        setStatus('로드 완료');
      }).catch((err)=>{
        console.error(err);
        setStatus('로딩 실패 — 예시 게임으로 전환');
        showFallback();
      });
    } catch (e) {
      setStatus('Unity 설정이 없어 예시 게임으로 전환');
      showFallback();
    }
  }

  boot();
})();

