// Gyldige koder → hvilken variant av landingssiden som vises.
// Nøkkelen er koden normalisert: små bokstaver og uten mellomrom,
// slik at både "Resort 2027" og "Resort2027" fungerer.
const KODER = {
  loshavn2027: 'loshavn',
  farsund2027: 'farsund',
  resort2027:  'resort',
};

const SESJON_NOKKEL = 'bryllup_adgang';
const VARIANT_NOKKEL = 'bryllup_variant';

const overlay   = document.getElementById('passordOverlay');
const felt      = document.getElementById('passordFelt');
const knapp     = document.getElementById('passordKnapp');
const feilTekst = document.getElementById('passordFeil');

function normaliser(kode) {
  return kode.toLowerCase().replace(/\s+/g, '');
}

// Viser seksjoner som hører til varianten. Seksjoner merket med
// data-kode er skjult i CSS; vi fjerner attributtet på dem som skal vises.
function visVariant(variant) {
  document.body.dataset.variant = variant;

  document.querySelectorAll('[data-kode]').forEach((el) => {
    const varianter = el.dataset.kode.split(/\s+/);
    if (varianter.includes(variant)) el.removeAttribute('data-kode');
  });
}

// Allerede godkjent i denne nettleser-sesjonen?
if (sessionStorage.getItem(SESJON_NOKKEL) === '1') {
  const lagretVariant = sessionStorage.getItem(VARIANT_NOKKEL);
  if (lagretVariant) visVariant(lagretVariant);
  overlay.classList.add('skjult');
}

function sjekkKode() {
  const variant = KODER[normaliser(felt.value.trim())];

  if (variant) {
    sessionStorage.setItem(SESJON_NOKKEL, '1');
    sessionStorage.setItem(VARIANT_NOKKEL, variant);
    visVariant(variant);
    overlay.classList.add('skjult');
  } else {
    felt.classList.add('feil');
    feilTekst.classList.add('synlig');
    felt.value = '';
    setTimeout(() => felt.classList.remove('feil'), 400);
  }
}

knapp.addEventListener('click', sjekkKode);

felt.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sjekkKode();
  feilTekst.classList.remove('synlig');
});
