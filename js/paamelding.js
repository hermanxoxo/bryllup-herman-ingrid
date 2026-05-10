// Google Apps Script URL – skriver direkte til Google Sheets
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzpwIHN5Jwm3eKSlXJPju1TeLAtJjVF7i16uf7ni9c2PUYr8O2OnA3H0ofE7RzBqn9p0g/exec';

// Vis/skjul følge-felt
const hasGuestCheckbox  = document.getElementById('hasGuest');
const guestNameField    = document.getElementById('guestNameField');
const guestNameInput    = document.getElementById('guestName');

hasGuestCheckbox.addEventListener('change', () => {
  const show = hasGuestCheckbox.checked;
  guestNameField.hidden = !show;
  guestNameInput.required = show;
});

// Vis/skjul allergi-detaljer basert på antall
const allergyCount       = document.getElementById('allergyCount');
const allergyDetailField = document.getElementById('allergyDetailField');

allergyCount.addEventListener('change', () => {
  allergyDetailField.hidden = allergyCount.value === '0';
});

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

  if (hasGuestCheckbox.checked && !guestNameInput.value.trim()) {
    guestNameInput.classList.add('error');
    document.getElementById('guestError').classList.add('visible');
    valid = false;
  } else {
    guestNameInput.classList.remove('error');
    document.getElementById('guestError').classList.remove('visible');
  }

  if (!valid) return;

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sender …';

  const payload = {
    'Navn':                   nameInput.value.trim(),
    'Navn på følge':          hasGuestCheckbox.checked ? guestNameInput.value.trim() : '–',
    'Allergi og preferanser': allergyCount.value !== '0'
                                ? document.getElementById('allergyDetail').value.trim() || '–'
                                : '–',
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
