// Google Apps Script URL – skriver direkte til Google Sheets
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzpwIHN5Jwm3eKSlXJPju1TeLAtJjVF7i16uf7ni9c2PUYr8O2OnA3H0ofE7RzBqn9p0g/exec';

// Skjema-innsending → Google Sheets
const form        = document.getElementById('rsvpForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

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

  const payload = {
    'Navn':                   nameInput.value.trim(),
    'Ønsker hotell':          document.getElementById('wantsHotel').checked ? 'Ja' : 'Nei',
    'Allergi og preferanser': document.getElementById('allergyDetail').value.trim() || '–',
    'Kommentar':              document.getElementById('comment').value.trim() || '–',
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

    form.hidden        = true;
    formSuccess.hidden = false;
    document.querySelector('.form-intro').hidden = true;

  } catch {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send påmelding';
    alert('Noe gikk galt. Prøv igjen eller kontakt oss direkte.');
  }
});
