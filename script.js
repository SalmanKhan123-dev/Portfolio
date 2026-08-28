/* ============================================================
   SALMAN KHAN — PORTFOLIO  |  script.js
   ============================================================ */

/* ============================================================
   ⚙️  CONTACT SETTINGS
   ------------------------------------------------------------
   The "Send a message" form delivers straight to your inbox
   through web3forms.com. Your Web3Forms ACCESS KEY lives in
   index.html (the hidden "access_key" field) — paste it there.
   The only thing to set here is your WhatsApp number for the
   "Message me on WhatsApp" button. Full guide: README.txt.
   ============================================================ */
const WHATSAPP_NUMBER = '919389600312';   // country code + number — no +, spaces or dashes
/* ========================================================== */

/* ---------- Scroll Fade-Up Animations ---------- */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* ---------- Nav: active-link highlight + hide-on-scroll-down ---------- */
const navBar   = document.querySelector('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  /* hide the bar while scrolling DOWN (once past the hero),
     bring it back the moment you scroll UP */
  if (navBar) {
    if (y > lastScrollY && y > 120) {
      navBar.classList.add('nav-hidden');
    } else {
      navBar.classList.remove('nav-hidden');
    }
  }
  lastScrollY = y;

  /* highlight the link for whichever section is in view */
  let current = '';
  sections.forEach(section => {
    if (y >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color =
      link.getAttribute('href') === '#' + current ? 'var(--gold)' : '';
  });
});

/* ============================================================
   PROJECT IMAGE LIGHTBOX
   Click any project screenshot to open it large. Arrow buttons,
   left/right keys step through that project's 3 shots, Esc closes.
   ============================================================ */

(function () {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbText  = document.getElementById('lightbox-caption-text');
  const lbCount = document.getElementById('lightbox-count');
  if (!lb || !lbImg) return;

  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn  = lb.querySelector('.lightbox-prev');
  const nextBtn  = lb.querySelector('.lightbox-next');

  let group = [];
  let index = 0;

  function render() {
    const item = group[index];
    if (!item) return;

    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbText.textContent  = item.alt;
    lbCount.textContent = (index + 1) + ' / ' + group.length;

    /* replay the pop-in animation on every step */
    lbImg.style.animation = 'none';
    void lbImg.offsetWidth;
    lbImg.style.animation = '';

    const many = group.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  }

  function open(items, i) {
    group = items;
    index = i;
    render();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    closeBtn.focus();
  }

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    lbImg.removeAttribute('src');
  }

  function step(dir) {
    if (!group.length) return;
    index = (index + dir + group.length) % group.length;
    render();
  }

  /* wire up every card's shots as its own group
     (a project card holds 3, a certificate or internship card holds 1) */
  document.querySelectorAll('.project-card, .cert-item, .exp-card').forEach(card => {
    const shots = Array.prototype.slice.call(
      card.querySelectorAll('.project-shot, .cert-shot')
    );
    const items = shots.map(a => {
      const img = a.querySelector('img');
      return {
        src: a.getAttribute('href'),
        alt: img ? img.alt : ''
      };
    });
    shots.forEach((a, i) => {
      a.addEventListener('click', e => {
        e.preventDefault();
        open(items, i);
      });
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  /* click the dark backdrop to dismiss */
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();

/* ============================================================
   CONTACT FORM  →  delivers to your inbox via Web3Forms
   (paste your access key into the hidden field in index.html)
   ============================================================ */

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const contactForm = document.getElementById('contact-form');
const sendBtn     = document.getElementById('send-btn');
const formStatus  = document.getElementById('form-status');
const whatsappBtn = document.getElementById('whatsapp-btn');

/* small helper: show a colour-coded line under the button */
function setStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = 'form-status show' + (type ? ' ' + type : '');
}

/* read the four visible fields once */
function readFields() {
  return {
    name:    (document.querySelector('[name="name"]')    || {}).value?.trim() || '',
    email:   (document.querySelector('[name="email"]')   || {}).value?.trim() || '',
    subject: (document.querySelector('[name="subject"]') || {}).value?.trim() || '',
    message: (document.querySelector('[name="message"]') || {}).value?.trim() || ''
  };
}

/* ---------- Send → deliver to inbox via Web3Forms ---------- */
if (contactForm && sendBtn) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const f = readFields();

    if (!f.name || !f.email || !f.message) {
      setStatus('Please fill in your name, email and message.', 'error');
      return;
    }

    /* make sure the access key has actually been pasted in */
    const keyEl = contactForm.querySelector('[name="access_key"]');
    const key   = keyEl ? keyEl.value.trim() : '';
    if (!key || key.indexOf('PASTE') !== -1) {
      setStatus('Contact form isn\'t set up yet — add your Web3Forms access key (see README.txt).', 'error');
      return;
    }

    /* build the payload from the form, with a tidy subject line */
    const formData = new FormData(contactForm);
    formData.set('subject', f.subject ? (f.subject + ' — from ' + f.name)
                                      : ('New portfolio message from ' + f.name));
    formData.set('from_name', f.name);

    sendBtn.disabled = true;
    setStatus('Sending your message…', '');

    fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.success) {
          setStatus('Message sent — thanks, ' + f.name.split(' ')[0] + '! I\'ll reply to your email soon.', 'success');
          contactForm.reset();
        } else {
          setStatus('Could not send: ' + ((data && data.message) || 'please try WhatsApp or email me directly.'), 'error');
        }
        sendBtn.disabled = false;
      })
      .catch(function (err) {
        console.error('Web3Forms error:', err);
        setStatus('Network error — please try WhatsApp or email me directly.', 'error');
        sendBtn.disabled = false;
      });
  });
}

/* ---------- WhatsApp (separate button) ---------- */
if (whatsappBtn) {
  whatsappBtn.addEventListener('click', function () {
    const f = readFields();
    const text =
      'Hello Salman!%0A%0A' +
      '*Name:* '    + encodeURIComponent(f.name || '—')    + '%0A' +
      '*Email:* '   + encodeURIComponent(f.email || '—')   + '%0A' +
      '*Subject:* ' + encodeURIComponent(f.subject || '—') + '%0A%0A' +
      '*Message:*%0A' + encodeURIComponent(f.message || '—');
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text, '_blank');
  });
}
