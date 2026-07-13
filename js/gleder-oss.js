// Felles «Vi gleder oss»-seksjon. Vises på alle varianter av landingssiden,
// uavhengig av hvilken gyldig kode gjesten har brukt.
// Endringer her slår automatisk gjennom overalt seksjonen er montert
// (element med id="glederOssMount").
const GLEDER_OSS_HTML = `
  <section class="section gs-link-teaser">
    <div class="container gs-link-teaser__inner">
      <div>
        <h2 class="section__title section__title--left">🎉 Del din glede</h2>
        <p>Send en hilsen og et bilde til brudeparet og de andre gjestene.</p>
      </div>
      <a href="glederseg.html" class="btn-gs">Se &amp; del hilsener</a>
    </div>
  </section>
`;

const glederOssMount = document.getElementById('glederOssMount');
if (glederOssMount) glederOssMount.innerHTML = GLEDER_OSS_HTML;
