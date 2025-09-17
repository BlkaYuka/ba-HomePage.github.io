// Year stamp
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Page enter
window.addEventListener('load', () => {
  document.body.classList.remove('is-entering');
});

// Slide reveal trigger: when reveal section is visible, slide panel up and raise stage
(function slideReveal(){
  const reveal = document.getElementById('reveal');
  if(!reveal) return;
  const on = (add) => document.body.classList.toggle('has-slide', !!add);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ on(true); }
    });
  }, { threshold: 0.25 });
  io.observe(reveal);
})();

// Subtle pointer parallax for hero title and promo card
(function parallax(){
  const hero = document.getElementById('hero');
  const promo = document.querySelector('.promo-card');
  const title = document.getElementById('title');
  if(!hero) return;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    if (promo) {
      promo.style.transform = `rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg)`;
    }
    if (title) {
      title.style.transform = `translate3d(${(x*6).toFixed(1)}px, ${(y*4).toFixed(1)}px, 0)`;
    }
  });
  hero.addEventListener('pointerleave', () => {
    if (promo) promo.style.transform = '';
    if (title) title.style.transform = '';
  });
})();

// Render "더 많은 게임" row on home (compact cards)
(async function moreGames(){
  const row = document.getElementById('more-games-row');
  if(!row) return;
  const featured = './games/game3/index.html';
  let list = [];
  try{
    const res = await fetch('./games/config.json', {cache:'no-store'});
    if(res.ok){
      const data = await res.json();
      list = Array.isArray(data.games) ? data.games : [];
    }
  }catch(e){
    list = [
      { title:'Unity WebGL', desc:'전체화면 지원, 로딩 필요', cover:'./assets/main-hero.png', src:'./game.html' },
      { title:'HTML5 캔버스(예시)', desc:'가벼운 예시 게임', cover:'./assets/main-hero.png', src:'./game-canvas.html' },
      { title:'임베드 게임 #2', desc:'별도 폴더의 게임 임베드', cover:'./assets/main-hero.png', src:'./games/game2/index.html' },
      { title:'임베드 게임 #3', desc:'별도 폴더의 게임 임베드', cover:'./assets/main-hero.png', src:'./games/game3/index.html' }
    ];
  }
  const others = list.filter(g => g && g.src && g.src !== featured).slice(0,6);
  const frag = document.createDocumentFragment();
  others.forEach(item => {
    const a = document.createElement('a');
    a.className = 'game-card';
    const url = new URL('./play.html', location.href);
    url.searchParams.set('src', item.src);
    url.searchParams.set('title', item.title);
    a.href = url.toString();
    const img = document.createElement('img');
    img.src = item.cover || './assets/main-hero.png';
    img.alt = item.title;
    const box = document.createElement('div');
    box.className = 'gx';
    const t = document.createElement('div');
    t.className = 't';
    t.textContent = item.title;
    const d = document.createElement('div');
    d.className = 'd';
    d.textContent = item.desc || 'HTML5 게임';
    box.appendChild(t); box.appendChild(d);
    a.appendChild(img); a.appendChild(box);
    frag.appendChild(a);
  });
  row.innerHTML = '';
  row.appendChild(frag);
})();
