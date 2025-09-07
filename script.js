// Year stamp
document.getElementById('year').textContent = new Date().getFullYear();

// Share link copy
const shareLink = document.getElementById('shareLink');
if (shareLink) {
  shareLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        shareLink.textContent = '링크 복사 완료!';
      } else {
        const el = document.createElement('input');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        el.remove();
        shareLink.textContent = '링크 복사 완료!';
      }
    } catch {
      shareLink.textContent = '복사 실패, 직접 복사해주세요';
    }
    setTimeout(() => (shareLink.textContent = '사이트 링크 복사'), 2000);
  });
}

// Countdown to event day (edit date below)
(function initCountdown(){
  const el = document.getElementById('countdown');
  if (!el) return;
  // TODO: 날짜를 실제 행사 날짜에 맞게 수정하세요 (YYYY-MM-DD)
  const target = new Date('2025-10-12T10:00:00+09:00');
  function tick(){
    const now = new Date();
    const diff = +target - +now;
    if (diff <= 0) {
      el.textContent = '오늘 현장에서 만나요!';
      return;
    }
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    el.textContent = `D-${d} ${h}시간 ${m}분 ${s}초`;
    requestAnimationFrame(tick);
  }
  tick();
})();

// Sky reveal on scroll
(function skyReveal(){
  const sky = document.getElementById('sky');
  if(!sky) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        sky.classList.add('reveal');
      }
    });
  }, { threshold: 0.2 });
  io.observe(sky);
})();

// Load a compact list of other games (homepage)
(async function loadMoreGames(){
  const row = document.getElementById('games-row');
  if(!row) return;
  const featuredSrc = './games/game3/index.html';
  let list = [];
  try{
    const res = await fetch('./games/config.json', {cache:'no-store'});
    if(res.ok){
      const data = await res.json();
      list = Array.isArray(data.games) ? data.games : [];
    }
  }catch(e){
    // fallback
    list = [
      { title:'Unity WebGL', desc:'전체화면 지원, 로딩 필요', cover:'./assets/sample.jpg', src:'./game.html' },
      { title:'HTML5 캔버스(예시)', desc:'가벼운 예시 게임', cover:'./assets/sample.jpg', src:'./game-canvas.html' },
      { title:'임베드 게임 #2', desc:'별도 폴더의 게임 임베드', cover:'./assets/sample.jpg', src:'./games/game2/index.html' },
      { title:'임베드 게임 #3', desc:'별도 폴더의 게임 임베드', cover:'./assets/sample.jpg', src:'./games/game3/index.html' }
    ];
  }
  // exclude featured, limit to 6
  const others = list.filter(g => (g && g.src) && g.src !== featuredSrc).slice(0,6);
  const frag = document.createDocumentFragment();
  others.forEach(item => {
    const a = document.createElement('a');
    a.className = 'game-card';
    const url = new URL('./play.html', location.href);
    url.searchParams.set('src', item.src);
    url.searchParams.set('title', item.title);
    a.href = url.toString();

    const img = document.createElement('img');
    img.src = item.cover || './assets/sample.jpg';
    img.alt = item.title;
    a.appendChild(img);

    const box = document.createElement('div');
    box.className = 'gx';
    const t = document.createElement('div');
    t.className = 't';
    t.textContent = item.title;
    const d = document.createElement('div');
    d.className = 'd';
    d.textContent = item.desc || 'HTML5 게임';
    box.appendChild(t);
    box.appendChild(d);
    a.appendChild(box);

    frag.appendChild(a);
  });
  row.innerHTML = '';
  row.appendChild(frag);
})();
