/* ==========================================================
   AD SETUP — Sirf yahan values bharo. Jo use nahi karna, khali chhod do.
   ========================================================== */
const AD_CONFIG = {
  adsense:            "",   // "ca-pub-1234567890123456"
  monetag:            "",   // "1234567"   (Monetag zone id)
  adsterraPopunder:   "https://capitalhospitals.org/1/1cdad989be4749f71e0df75abf13ce95",
  adsterraSocialBar:  "https://czernik.org/14/b052e6602d330113f4f9162ab0ba5ed8"
};

(function () {
  /* ---- Placeholder text sirf empty ad slots ke liye ---- */
  if (!AD_CONFIG.adsense) {
    document.querySelectorAll('.ad').forEach(d => {
      if (!d.children.length && !d.textContent.trim()) {
        d.textContent = 'AD SLOT';
      }
    });
  }

  /* ---- Google AdSense ---- */
  if (AD_CONFIG.adsense) {
    document.querySelectorAll('ins.adsbygoogle').forEach(el => {
      el.dataset.adClient = AD_CONFIG.adsense;
    });
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + AD_CONFIG.adsense;
    document.head.appendChild(s);

    window.addEventListener('load', () => {
      document.querySelectorAll('ins.adsbygoogle').forEach(() => {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      });
    });
  }

  /* ---- Monetag (popunder + social bar + in-page push) ---- */
  if (AD_CONFIG.monetag) {
    const s = document.createElement('script');
    s.src = 'https://cdn.monetag.com/tag/' + AD_CONFIG.monetag + '.js';
    document.head.appendChild(s);
  }

  /* ---- Adsterra popunder ---- */
  if (AD_CONFIG.adsterraPopunder) {
    const s = document.createElement('script');
    s.src = AD_CONFIG.adsterraPopunder;
    s.setAttribute('data-cfasync', 'false');
    s.async = true;
    document.head.appendChild(s);
  }

  /* ---- Adsterra social bar ---- */
  if (AD_CONFIG.adsterraSocialBar) {
    const s = document.createElement('script');
    s.src = AD_CONFIG.adsterraSocialBar;
    s.setAttribute('data-cfasync', 'false');
    s.async = true;
    document.head.appendChild(s);
  }
})();