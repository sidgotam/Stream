(function () {
  const player = document.getElementById('player');
  const tabs = document.getElementById('tabs');
  if (!player || !tabs) {
    console.warn('player.js: #player ya #tabs HTML me nahi mila');
    return;
  }

  const id = window.MATCH_ID;
  const list = (window.SERVERS && window.SERVERS[id]) || [];

  if (!list.length || !list.some(s => s && s.src)) {
    player.innerHTML = '<div class="pl-empty">data/servers.js me link daalo</div>';
    return;
  }

  let hls = null;
  const failed = new Set();

  function nextFree(from) {
    for (let k = 1; k <= list.length; k++) {
      const i = (from + k) % list.length;
      if (!failed.has(i)) return i;
    }
    return from;
  }

  function cleanup() {
    if (hls) { hls.destroy(); hls = null; }
    player.innerHTML = '';
  }

  function load(i, manual) {
    if (!list[i] || !list[i].src) return;
    if (manual) failed.delete(i);

    [...tabs.children].forEach((b, x) => {
      b.classList.toggle('on', x === i);
      if (x === i) b.classList.remove('err');
    });

    cleanup();
    const src = list[i].src;

    let dead = false;
    const die = () => {
      if (dead) return;
      dead = true;
      failed.add(i);
      const btn = tabs.children[i];
      if (btn) btn.classList.add('err');
      const n = nextFree(i);
      if (n !== i) setTimeout(() => load(n), 500);
    };

    if (/\.m3u8(\?|#|$)/i.test(src)) {
      const v = document.createElement('video');
      v.controls = true;
      v.autoplay = true;
      v.muted = true;
      v.setAttribute('playsinline', '');
      v.addEventListener('error', die);
      player.appendChild(v);

      if (window.Hls && window.Hls.isSupported()) {
        const inst = new Hls({ lowLatencyMode: true, liveSyncDurationCount: 3, maxBufferLength: 12 });
        hls = inst;
        let tries = 0;

        inst.on(Hls.Events.ERROR, (e, d) => {
          if (!d.fatal) return;
          if (d.type === Hls.ErrorTypes.MEDIA_ERROR) { inst.recoverMediaError(); return; }
          tries++;
          if (tries >= 2) { die(); return; }
          inst.startLoad();
        });
        inst.on(Hls.Events.MANIFEST_PARSED, () => v.play().catch(() => {}));
        inst.loadSource(src);
        inst.attachMedia(v);

      } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = src;
        v.play().catch(() => {});
      } else {
        die();
      }

    } else {
      const f = document.createElement('iframe');
      f.src = src;
      f.allowFullscreen = true;
      f.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
      player.appendChild(f);
    }
  }

  list.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = (s && s.name) || ('Server ' + (i + 1));
    b.onclick = () => load(i, true);
    tabs.appendChild(b);
  });

  load(0);
})();