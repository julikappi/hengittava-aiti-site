/*
 * Nollaushetken banneri (hengittava-aiti.fi, 17.11.2026)
 *
 * SEURAAVAAN NOLLAUSHETKEEN: muuta vain alla oleva NOLLAUS-lohko.
 *   aika     = näkyvä päivä ja kellonaika
 *   piiloon  = milloin banneri katoaa itsestään (yleensä noin 45 min alun jälkeen)
 * Muista päivittää myös /nollaushetki/-sivun päivä ja lomake.
 * Kopioi tiedosto myös kansioon public/ (sama sisältö).
 * Ilmaisuus sanotaan vain kerran (Juliana 17.11.: "yhden kerran riittää").
 * Banneri on vain etusivulla (Juliana 17.11.: klubisivulla se kilpaili kokeilunapin kanssa).
 */
var NOLLAUS = {
  pieni: '🌕 Ilmainen hetki sinulle Zoomissa',
  otsikko: 'Täydenkuun nollaushetki',
  aika: 'ti 24.11. klo 21',
  teksti: 'Miniluento ja kehollinen nollaus.',
  lisa: 'Noin 30 minuuttia, avoin kaikille.',  // näkyy vain isommalla näytöllä
  nappi: 'Ilmoittaudu',
  linkki: '/nollaushetki/#ilmoittaudu',
  piiloon: '2026-11-24T21:45:00+02:00'
};

(function () {
  if (!NOLLAUS || !NOLLAUS.aika) return;
  if (new Date() > new Date(NOLLAUS.piiloon)) return;
  if (/^\/nollaushetki/.test(location.pathname)) return;

  var avain = 'nollausBanneriSuljettu:' + NOLLAUS.piiloon;
  try { if (sessionStorage.getItem(avain)) return; } catch (e) {}

  var css = ''
    + '.nb{position:fixed;z-index:60;left:12px;right:12px;bottom:12px;max-width:24rem;'
    + 'background:radial-gradient(120% 90% at 0% 0%,#4A3757 0%,#3B2A45 45%,#271C30 100%);color:#FBF7F1;border-radius:18px;padding:16px 16px 16px;'
    + 'box-shadow:0 18px 40px -12px rgba(30,20,35,.55);font-family:inherit;'
    + 'transform:translateY(calc(100% + 24px));opacity:0;transition:transform .55s cubic-bezier(.2,1.25,.4,1),opacity .3s ease,bottom .25s ease}'
    + '.nb.nb--auki{transform:translateY(0);opacity:1}'
    + '@media (min-width:40rem){.nb{left:auto;right:24px;bottom:24px}}'
    + '.nb-rivi{display:flex;gap:14px;align-items:center}'
    + '.nb-kuu{flex:none;width:68px;height:68px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 1px rgba(255,250,235,.25),0 0 22px 6px rgba(255,246,220,.38),0 0 60px 14px rgba(255,240,210,.16);animation:nbKuu 6s ease-in-out infinite}'
    + '@keyframes nbKuu{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}'
    + '.nb-tahti{position:absolute;color:rgba(255,248,225,.75);font-size:10px;line-height:1;pointer-events:none}'
    + '.nb-pieni{margin:0 0 4px;padding-right:34px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:.8rem;font-weight:600;letter-spacing:.02em;color:rgba(251,247,241,.78)}'
    + '.nb-otsikko{margin:0;font-family:inherit;font-size:1.18rem;line-height:1.25;font-weight:600;color:#FBF7F1}'
    + '.nb-teksti{margin:6px 0 0;font-size:.95rem;line-height:1.45;color:rgba(251,247,241,.88)}'
    + '.nb-nappi{display:flex;align-items:center;justify-content:center;margin-top:14px;min-height:46px;padding:10px 18px;'
    + 'border-radius:999px;background:#FBF7F1;color:#3B2A45;font-weight:700;font-size:1rem;text-decoration:none}'
    + '.nb-nappi:hover{background:#fff}'
    + '.nb-nappi:focus-visible,.nb-kiinni:focus-visible{outline:2px solid #F2C9B0;outline-offset:2px}'
    + '.nb-kiinni{position:absolute;top:6px;right:6px;width:40px;height:40px;border:0;border-radius:50%;'
    + 'background:transparent;color:rgba(251,247,241,.8);font-size:1.6rem;line-height:1;cursor:pointer}'
    + '.nb-kiinni:hover{color:#fff;background:rgba(251,247,241,.08)}'
    + '@media (max-width:39.99rem){.nb{padding:12px 14px 12px}.nb-lisa{display:none}.nb-kuu{width:56px;height:56px}.nb-pieni{font-size:.76rem}'
    + '.nb-otsikko{font-size:1.05rem}.nb-pieni{padding-right:30px}.nb-teksti{margin-top:2px}.nb-nappi{margin-top:10px;min-height:42px;padding:8px 16px}'
    + '.nb-kiinni{top:2px;right:2px}}'
    + '@media (prefers-reduced-motion:reduce){.nb-kuu{animation:none}.nb{transition:opacity .2s ease}.nb,.nb.nb--auki{transform:none}}';

  function nayta() {
    var tyyli = document.createElement('style');
    tyyli.textContent = css;
    document.head.appendChild(tyyli);

    var nb = document.createElement('aside');
    nb.className = 'nb';
    nb.setAttribute('aria-label', NOLLAUS.otsikko + ' ' + NOLLAUS.aika);
    nb.innerHTML = ''
      + '<span class="nb-tahti" style="top:12px;left:70px" aria-hidden="true">✦</span>'
      + '<span class="nb-tahti" style="bottom:64px;right:18px;font-size:8px" aria-hidden="true">✦</span>'
      + '<button class="nb-kiinni" type="button" aria-label="Sulje">&times;</button>'
      + '<div class="nb-rivi">'
      + '<img class="nb-kuu" src="/kuvat/taysikuu-kiekko-a.jpg" width="68" height="68" alt="" aria-hidden="true">'
      + '<div>'
      + '<p class="nb-pieni"></p>'
      + '<p class="nb-otsikko"></p>'
      + '<p class="nb-teksti"><span class="nb-lyhyt"></span> <span class="nb-lisa"></span></p>'
      + '</div></div>'
      + '<a class="nb-nappi"></a>';
    // Päivä pysyy yhdellä rivillä (sitovat välilyönnit).
    nb.querySelector('.nb-pieni').textContent = NOLLAUS.pieni || '';
    nb.querySelector('.nb-otsikko').textContent = NOLLAUS.otsikko + ' ' + NOLLAUS.aika.replace(/ /g, '\u00a0');
    nb.querySelector('.nb-lyhyt').textContent = NOLLAUS.teksti;
    nb.querySelector('.nb-lisa').textContent = NOLLAUS.lisa || '';
    var a = nb.querySelector('.nb-nappi');
    a.textContent = NOLLAUS.nappi;
    a.href = NOLLAUS.linkki;
    document.body.appendChild(nb);

    nb.querySelector('.nb-kiinni').addEventListener('click', function () {
      nb.classList.remove('nb--auki');
      try { sessionStorage.setItem(avain, '1'); } catch (e) {}
      setTimeout(function () { nb.remove(); }, 600);
    });

    // Klubisivun mobiilin liittymispalkki: banneri nousee sen yläpuolelle.
    var palkki = document.getElementById('sticky-cta');
    function sijoita() {
      var nakyy = palkki && palkki.classList.contains('is-visible') && palkki.offsetHeight;
      nb.style.bottom = nakyy ? (palkki.offsetHeight + 12) + 'px' : '';
    }
    if (palkki) {
      window.addEventListener('scroll', sijoita, { passive: true });
      window.addEventListener('resize', sijoita);
      sijoita();
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { nb.classList.add('nb--auki'); });
    });
  }

  function ajasta() { setTimeout(nayta, 1500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ajasta);
  else ajasta();
})();
