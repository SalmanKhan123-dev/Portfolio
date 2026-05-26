/* ============================================================
   SALMAN KHAN — PORTFOLIO  |  script.js
   ============================================================ */

/* ---------- Custom Cursor ---------- */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

let mx = 0, my = 0;
let rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

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

/* ---------- Active Nav Highlight on Scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color =
      link.getAttribute('href') === '#' + current ? 'var(--gold)' : '';
  });
});

/* ============================================================
   CONTACT FORM — EmailJS + WhatsApp
   Fill in your 3 keys below (see guide at bottom of this file)
   ============================================================ */

emailjs.init(xLqgEoy2P13GB9m3d);

document.getElementById('send-btn').addEventListener('click', function () {
  const btn = document.getElementById('send-btn');

 const name    = document.querySelector('[name="name"]').value.trim();
const email   = document.querySelector('[name="email"]').value.trim();
const subject = document.querySelector('[name="title"]').value.trim();
const message = document.querySelector('[name="message"]').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in your Name, Email and Message.');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Step 1 — Send email via EmailJS
  emailjs.sendForm(service_qmwaqfl, template_9a76u6b, '#contact-form')
    .then(() => {

      // Step 2 — Open WhatsApp with pre-filled message
      const waText = `Hello Salman!%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Subject:* ${encodeURIComponent(subject)}%0A%0A*Message:*%0A${encodeURIComponent(message)}`;
      const waURL  = `https://wa.me/919389600312?text=${waText}`;
      window.open(waURL, '_blank');

      // Success state
      btn.innerHTML = '<i class="fas fa-check"></i> &nbsp;Sent!';
      btn.style.background = '#2ecc71';
      document.getElementById('contact-form').reset();

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);

    })
    .catch(err => {
      // Error state
      btn.innerHTML = '<i class="fas fa-times"></i> &nbsp;Failed — Try Again';
      btn.style.background = '#e74c3c';
      btn.disabled = false;
      console.error('EmailJS error:', err);

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Send Message';
        btn.style.background = '';
      }, 3000);
    });
});