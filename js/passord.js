const KODE = 'loshavn';
const SESJON_NOKKEL = 'bryllup_adgang';

const overlay   = document.getElementById('passordOverlay');
const felt      = document.getElementById('passordFelt');
const knapp     = document.getElementById('passordKnapp');
const feilTekst = document.getElementById('passordFeil');

// Allerede godkjent i denne nettleser-sesjonen?
if (sessionStorage.getItem(SESJON_NOKKEL) === '1') {
  overlay.classList.add('skjult');
}

function sjekkKode() {
  if (felt.value.trim().toLowerCase() === KODE) {
    sessionStorage.setItem(SESJON_NOKKEL, '1');
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
