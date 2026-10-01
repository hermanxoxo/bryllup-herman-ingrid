// Google Apps Script URL – skriver direkte til Google Sheets
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzpwIHN5Jwm3eKSlXJPju1TeLAtJjVF7i16uf7ni9c2PUYr8O2OnA3H0ofE7RzBqn9p0g/exec';

// Skjema-innsending → Google Sheets
const form        = document.getElementById('rsvpForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// «Kan ikke komme»: skjuler feltene som bare gjelder de som deltar
const cannotAttend   = document.getElementById('cannotAttend');
const attendeeFields = document.querySelectorAll('[data-kun-deltakere]');

function submitLabel() {
  return cannotAttend.checked ? 'Send svar' : 'Send påmelding';
}

cannotAttend.addEventListener('change', () => {
  attendeeFields.forEach((el) => { el.hidden = cannotAttend.checked; });
  submitBtn.textContent = submitLabel();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validering
  let valid = true;

  const nameInput = document.getElementById('name');
  const nameError = document.getElementById('nameError');
  if (!nameInput.value.trim()) {
    nameInput.classList.add('error');
    nameError.classList.add('visible');
    valid = false;
  } else {
    nameInput.classList.remove('error');
    nameError.classList.remove('visible');
  }

  if (!valid) return;

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sender …';

  const declined = cannotAttend.checked;
  const comment  = document.getElementById('comment').value.trim();

  // Avslag merkes i Kommentar, slik at arket og Apps Script-et kan
  // beholde de fire opprinnelige kolonnene uendret.
  const payload = {
    'Navn':                   nameInput.value.trim(),
    'Ønsker hotell':          !declined && document.getElementById('wantsHotel').checked ? 'Ja' : 'Nei',
    'Allergi og preferanser': (!declined && document.getElementById('allergyDetail').value.trim()) || '–',
    'Kommentar':              declined
      ? 'KAN IKKE KOMME' + (comment ? ' – ' + comment : '')
      : comment || '–',
  };

  try {
    // no-cors: Google Apps Script støtter ikke CORS-headers fra nettleser,
    // men data skrives til arket uansett. Vi viser alltid suksess ved ingen nettverksfeil.
    await fetch(SHEET_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(payload),
    });

    if (declined) {
      document.getElementById('successTitle').textContent = 'Takk for svaret!';
      document.getElementById('successText').textContent  = 'Så synd at du/dere ikke kan komme.';
    }

    form.hidden        = true;
    formSuccess.hidden = false;
    document.querySelector('.form-intro').hidden = true;

  } catch {
    submitBtn.disabled    = false;
    submitBtn.textContent = submitLabel();
    alert('Noe gikk galt. Prøv igjen eller kontakt oss direkte.');
  }
});
