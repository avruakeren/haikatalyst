/* ============================================================
   HAIKATALYST — TV FIT + RESPONSIVE
   Skala kanvas 1920x1080 hanya untuk layar TV besar (>=2000px
   lebar). Di laptop/tablet/HP, kanvas dibuka jadi tata letak web
   responsif (desain mengalir mengikuti ukuran layar), sehingga
   tidak kegedean.

   Halaman ber-`data-fit="fit"` di <body> (contoh: landing page)
   selalu diskalakan penuh ke layar agar tampil fullscreen tanpa
   scroll di perangkat apa pun.

   Mode masih bisa dipaksa lewat URL ?tv=1 (paksa TV) / ?tv=0
   (paksa web) — misal untuk TV 1080p yang tak terdeteksi otomatis.
   Dipanggil oleh setiap halaman.
   ============================================================ */
(function () {
  'use strict';

  var DESIGN_W = 1920;
  var DESIGN_H = 1080;

  var app = document.getElementById('tv-app') || document.querySelector('.tv-app');

  var fitAlways =
    (document.body && document.body.getAttribute('data-fit') === 'fit') ||
    (document.documentElement.getAttribute('data-fit') === 'fit');

  function paramMode() {
    var m = /[?&]tv=([01])/.exec(window.location.search);
    if (!m) return null;
    return m[1] === '1' ? 'tv' : 'web';
  }

  // Layar dianggap TV bila lebarnya 2000px+ DAN tingginya 1200px+.
  // Laptop FHD (1920x1080) otomatis masuk mode responsif.
  function isTvLike() {
    return window.innerWidth >= 2000 && window.innerHeight >= 1200;
  }

  function effectiveMode() {
    if (fitAlways) return 'tv';
    var p = paramMode();
    if (p) return p;
    return isTvLike() ? 'tv' : 'web';
  }

  function apply() {
    if (!app) return;
    if (effectiveMode() === 'tv') {
      // MODE TV / FULLSCREEN: kanvas 1920x1080 di-scale penuh ke layar
      document.body.classList.remove('responsive');
      document.body.classList.add('tv-locked');
      app.classList.add('tv-app');
      var scale = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
      app.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
      app.style.transformOrigin = '50% 50%';
      app.style.width = '';
      app.style.height = '';
      app.style.position = '';
      app.style.top = '';
      app.style.left = '';
    } else {
      // MODE RESPONSIF: buka kanvas, ikuti alur dokumen normal
      document.body.classList.add('responsive');
      document.body.classList.remove('tv-locked');
      app.classList.remove('tv-app');
      app.style.transform = '';
      app.style.transformOrigin = '';
      app.style.width = '';
      app.style.height = '';
      app.style.position = '';
      app.style.top = '';
      app.style.left = '';
    }
  }

  if (app) {
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('load', apply);
    setTimeout(apply, 300);
  }
})();
