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

