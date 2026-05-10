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

// Skjema-innsending via Formsubmit.co (sender e-post til hermanhaukenes@yahoo.no)
const form        = document.getElementById('rsvpForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Enkel validering
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

  // Send via Formsubmit.co AJAX
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sender …';

  const data = new FormData(form);
  // Formsubmit-konfigurasjon
  data.append('_subject', `Påmelding til bryllup – ${nameInput.value.trim()}`);
  data.append('_captcha',  'false');
  data.append('_template', 'table');

  try {
    const res = await fetch('https://formsubmit.co/ajax/hermanhaukenes@yahoo.no', {
      method:  'POST',
      headers: { Accept: 'application/json' },
      body:    data,
    });

    if (res.ok) {
      form.hidden         = true;
      formSuccess.hidden  = false;
      document.querySelector('.form-intro').hidden = true;
    } else {
      throw new Error('server-error');
    }
  } catch {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send påmelding';
    alert('Noe gikk galt. Prøv igjen eller send e-post til hermanhaukenes@yahoo.no.');
  }
});
