(function () {
  const box = document.querySelector('[data-matches]');
  if (box) {
    const now  = Date.now();
    const mode = box.dataset.matches;
    const fmt  = d => new Date(d).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
    }) + ' IST';

    let list = (window.MATCHES || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    if (mode === 'upcoming') list = list.filter(m => new Date(m.date).getTime() > now - 4 * 3600e3);

    if (!list.length) {
      box.innerHTML = '<p style="color:#8b9bab">Filhal koi match schedule me nahi hai.</p>';
    } else {
      box.innerHTML = list.map(m => {
        const t = new Date(m.date).getTime();
        const live = t <= now && now < t + 4 * 3600e3;
        return '<a class="mcard" href="/match/' + m.id + '/">' +
          '<span class="tag' + (live ? ' live' : '') + '">' + (live ? 'LIVE' : 'UPCOMING') + '</span>' +
          '<h3>' + m.title + '</h3>' +
          '<div class="sub">' + fmt(m.date) + '</div>' +
          '<div class="sub">' + m.venue + '</div></a>';
      }).join('');
    }
  }

  document.querySelector('.burger')?.addEventListener('click', () => {
    document.querySelector('.nav ul')?.classList.toggle('open');
  });
})();