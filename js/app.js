// Gögn fyrir hverja tilgátu: spurning í samantekt, kostir og endurgjöf.
const SPURNINGAR = {
  flot: {
    titill: 'Tilgáta 1 – Hvor lögunin hefur meiri flotkraft miðað við stærð?',
    kostir: { 1: 'fig. 1. – skálin (Hafdís)', 2: 'fig. 2. – kassinn (Ástrós)' },
    rett: '2',
    rettTexti:
      '<p><strong>Vel rökstutt hjá ykkur – kassinn (fig. 2.) hefur meiri flotkraft miðað við stærð.</strong></p>' +
      '<p>Flotkrafturinn er jafn þyngd vatnsins sem báturinn ryður frá sér (lögmál Arkímedesar). Því meira rúmmál sem botninn getur „ýtt niður“ í vatnið, því meiri þyngd getur báturinn borið áður en hann sekkur.</p>' +
      '<p>Ef skálin og kassinn eru jafn breið og jafn há kemst næstum <em>tvöfalt meira</em> fyrir í kassanum, því hornin og flati botninn nýta allt plássið. Kassinn ryður því frá sér meira vatni og getur borið meiri farm. Flatur botn gerir hann líka stöðugri.</p>',
    rangtTexti:
      '<p><strong>Áhugaverð tilgáta – en kassinn (fig. 2.) hefur í raun meiri flotkraft miðað við stærð.</strong></p>' +
      '<p>Skálin lítur kannski út fyrir að vera „bátslegri“, en flotkrafturinn er jafn þyngd vatnsins sem báturinn ryður frá sér (lögmál Arkímedesar). Það sem skiptir máli er hve mikið rúmmál fer ofan í vatnið.</p>' +
      '<p>Ef skálin og kassinn eru jafn breið og jafn há kemst næstum <em>tvöfalt meira</em> fyrir í kassanum, því skálin mjókkar niður á við en kassinn nýtir allt plássið alveg út í hornin. Kassinn ryður því frá sér meira vatni og getur borið meiri farm.</p>'
  },
  skrufa: {
    titill: 'Tilgáta 2 – Hvor aðferðin við að skrúfa ísskrúfu er traustari?',
    kostir: { 1: 'fig. 1. – Ragnar (oddurinn hallar niður)', 2: 'fig. 2. – Lóa (hausinn hallar niður)' },
    rett: '2',
    rettTexti:
      '<p><strong>Rétt hjá ykkur – aðferðin hennar Lóu (fig. 2.) er traustari.</strong></p>' +
      '<p>Lengi héldu fjallamenn að best væri að láta oddinn vísa niður, eins og í fig. 1. Prófanir hafa hins vegar sýnt að skrúfa sem hallar um 10–15° þannig að hausinn er neðar en oddurinn heldur betur.</p>' +
      '<p>Þegar þungi togar niður í hausinn þrýstast gengjurnar upp í ísinn fyrir ofan sig. Álagið dreifist þá eftir allri skrúfunni, eins og þegar margir krókar halda í einu. Í fig. 1. virkar skrúfan frekar eins og vogarstöng sem getur spennt hana út og brotið ísinn næst yfirborðinu, þar sem hann er veikastur.</p>',
    rangtTexti:
      '<p><strong>Margir hefðu valið eins og þið – en aðferðin hennar Lóu (fig. 2.) er í raun traustari.</strong></p>' +
      '<p>Lengi héldu fjallamenn einmitt að best væri að láta oddinn vísa niður, eins og í fig. 1. Prófanir hafa hins vegar sýnt að skrúfa sem hallar um 10–15° þannig að hausinn er neðar en oddurinn heldur betur.</p>' +
      '<p>Þegar þungi togar niður í hausinn þrýstast gengjurnar upp í ísinn fyrir ofan sig og álagið dreifist eftir allri skrúfunni. Í fig. 1. virkar skrúfan frekar eins og vogarstöng sem getur spennt hana út og brotið ísinn næst yfirborðinu, þar sem hann er veikastur.</p>'
  },
  skutla: {
    titill: 'Tilgáta 3 – Hvor skutlan flýgur betur?',
    kostir: { 1: 'fig. 1. – skutlan hennar Fanneyjar', 2: 'fig. 2. – hringskutlan (kórónan)' },
    rett: null,
    hlutlaust:
      '<p><strong>Tilgátan ykkar er skráð.</strong></p>' +
      '<p>Hér verður ekki gefið upp hvort er rétt – það kemur í ljós þegar þið prófið. Hugsið um hvernig þið gætuð prófað tilgátuna á sanngjarnan hátt: Hvað þýðir að fljúga „betur“? Lengra, beinna eða lengur í loftinu?</p>'
  }
};

const svor = {};
let skref = 0;

const skrefin = [...document.querySelectorAll('.skref')];
const framvinda = [...document.querySelectorAll('.framvinda li')];

function syna(n) {
  skref = n;
  skrefin.forEach(s => { s.hidden = Number(s.dataset.step) !== n; });
  framvinda.forEach(li => {
    const i = Number(li.dataset.step);
    li.classList.toggle('virkt', i === n);
    li.classList.toggle('lokid', i < n);
  });
  if (n === 4) byggjaSamantekt();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

skrefin.forEach(s => {
  const lykill = s.dataset.q;
  const naest = s.querySelector('[data-next]');
  if (naest) naest.addEventListener('click', () => syna(skref + 1));
  if (!lykill) return;

  const kostir = [...s.querySelectorAll('.kostur')];
  const stadfesta = s.querySelector('[data-submit]');
  const rok = s.querySelector('textarea');
  const endurgjof = s.querySelector('.endurgjof');
  let valid = null;

  kostir.forEach(k => {
    k.setAttribute('role', 'radio');
    k.setAttribute('aria-checked', 'false');
    k.addEventListener('click', () => {
      if (svor[lykill]) return;
      valid = k.dataset.val;
      kostir.forEach(x => {
        x.classList.toggle('valinn', x === k);
        x.setAttribute('aria-checked', String(x === k));
      });
      stadfesta.disabled = false;
    });
  });

  stadfesta.addEventListener('click', () => {
    if (!valid) return;
    const q = SPURNINGAR[lykill];
    svor[lykill] = { val: valid, rok: rok.value.trim() };
    kostir.forEach(x => { x.disabled = true; });
    rok.readOnly = true;
    stadfesta.hidden = true;

    if (q.rett) {
      const rett = valid === q.rett;
      kostir.forEach(x => x.classList.toggle('rett', x.dataset.val === q.rett));
      endurgjof.className = 'endurgjof ' + (rett ? 'jakvaed' : 'leidrett');
      endurgjof.innerHTML = rett ? q.rettTexti : q.rangtTexti;
    } else {
      endurgjof.className = 'endurgjof hlutlaus';
      endurgjof.innerHTML = q.hlutlaust;
    }
    endurgjof.hidden = false;
    naest.hidden = false;
    endurgjof.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

function byggjaSamantekt() {
  const nofn = document.getElementById('nofn').value.trim();
  const linur = ['Tilgátur hópsins'];
  if (nofn) linur.push('Hópur: ' + nofn);
  linur.push('');

  Object.entries(SPURNINGAR).forEach(([lykill, q]) => {
    const svar = svor[lykill];
    linur.push(q.titill);
    linur.push('Tilgáta okkar: ' + q.kostir[svar.val]);
    if (svar.rok) linur.push('Rökstuðningur: ' + svar.rok);
    if (q.rett) {
      linur.push(svar.val === q.rett
        ? 'Niðurstaða: Tilgátan reyndist rétt.'
        : 'Niðurstaða: Tilgátan reyndist röng – rétt svar er ' + q.kostir[q.rett] + '.');
    } else {
      linur.push('Niðurstaða: Á eftir að prófa.');
    }
    linur.push('');
  });

  document.getElementById('samantekt').textContent = linur.join('\n').trim();
}

document.getElementById('afrita').addEventListener('click', async () => {
  const texti = document.getElementById('samantekt').textContent;
  const stada = document.getElementById('afritad');
  try {
    await navigator.clipboard.writeText(texti);
    stada.textContent = 'Textinn hefur verið afritaður.';
  } catch {
    // Varaleið ef vafrinn leyfir ekki aðgang að klippiborði: velja textann.
    const svid = document.createRange();
    svid.selectNodeContents(document.getElementById('samantekt'));
    const val = window.getSelection();
    val.removeAllRanges();
    val.addRange(svid);
    stada.textContent = 'Textinn er valinn – ýtið á Ctrl+C (eða ⌘+C) til að afrita.';
  }
});

syna(0);
