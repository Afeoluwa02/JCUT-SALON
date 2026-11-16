/**
 * J-CUTZ v2 — Frontend Script
 * Features: Navbar, Scroll Animations, Testimonial Slider,
 *           Form Validation, WhatsApp Redirect Booking, Modal
 *
 * ⚙️ TO CHANGE THE WHATSAPP NUMBER:
 *    Find the line: const WHATSAPP_NUMBER = '2349124528495';
 *    Replace with the real business number (digits only, with country code)
 */

/* ============================================================
   CONFIG — Change this one line when going live
   ============================================================ */
const WHATSAPP_NUMBER = '2349124528495'; // ← Replace with real number


/* ============================================================
   1. NAVBAR — Transparent → Solid + Mobile Menu
   ============================================================ */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

// Solidify navbar on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveNav();
}, { passive: true });

// Toggle mobile menu
function openMobileNav() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  navBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navBackdrop.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMobileNav() : openMobileNav();
});
navBackdrop.addEventListener('click', closeMobileNav);
navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMobileNav));

// Highlight active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
function highlightActiveNav() {
  const y = window.pageYOffset + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    const id  = sec.getAttribute('id');
    const lnk = document.querySelector(`.nav-link[href="#${id}"]`);
    if (lnk) lnk.style.color = (y >= top && y < bot)
      ? 'var(--white)'
      : '';
  });
}


/* ============================================================
   2. SMOOTH SCROLL — All anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 75,
        behavior: 'smooth'
      });
    }
  });
});


/* ============================================================
   3. SCROLL REVEAL ANIMATIONS — IntersectionObserver
   ============================================================ */
const revealEls = document.querySelectorAll(
  '.reveal-fade, .reveal-up, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once only
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -70px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


/* ============================================================
   4. TESTIMONIALS SLIDER
   ============================================================ */
const sliderTrack = document.getElementById('tsliderTrack');
const dotsWrap    = document.getElementById('tDots');
const prevBtn     = document.getElementById('tPrev');
const nextBtn     = document.getElementById('tNext');

let currentIndex  = 0;
let autoTimer;
const sliderCards = sliderTrack ? Array.from(sliderTrack.children) : [];

// How many cards visible at once
function perView() {
  if (window.innerWidth < 600)  return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}
function totalPositions() {
  return Math.max(1, sliderCards.length - perView() + 1);
}

// Build pagination dots
function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  for (let i = 0; i < totalPositions(); i++) {
    const dot = document.createElement('div');
    dot.className = 'tdot' + (i === currentIndex ? ' active' : '');
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    dotsWrap.appendChild(dot);
  }
}

// Move slider to index
function goTo(index) {
  const total = totalPositions();
  currentIndex = (index + total) % total; // wrap around

  if (!sliderTrack || sliderCards.length === 0) return;
  const cardW = sliderCards[0].offsetWidth;
  const gap   = 24;
  sliderTrack.style.transform = `translateX(-${currentIndex * (cardW + gap)}px)`;

  // Update dots
  dotsWrap.querySelectorAll('.tdot').forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });
}

function goNext() { goTo(currentIndex + 1); }
function goPrev() { goTo(currentIndex - 1); }

if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goPrev(); startAuto(); });
if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goNext(); startAuto(); });

function startAuto() { autoTimer = setInterval(goNext, 5000); }
function stopAuto()  { clearInterval(autoTimer); }

// Touch swipe support
let touchStart = 0;
if (sliderTrack) {
  sliderTrack.addEventListener('touchstart', e => {
    touchStart = e.touches[0].clientX;
  }, { passive: true });
  sliderTrack.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      diff > 0 ? goNext() : goPrev();
      startAuto();
    }
  });
}

// Init slider
window.addEventListener('DOMContentLoaded', () => {
  buildDots();
  startAuto();
});
window.addEventListener('resize', () => {
  buildDots();
  goTo(0);
});


/* ============================================================
   5. BOOKING FORM — Date minimum + Validation + WhatsApp
   ============================================================ */

// Set minimum date to today (can't book in the past)
const dateInput = document.getElementById('bdate');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

const bookingForm = document.getElementById('bookingForm');
const submitBtn   = document.getElementById('submitBtn');

if (bookingForm) {
  bookingForm.addEventListener('submit', handleBookingSubmit);
}

/**
 * Validate all fields.
 * Returns true if all valid, false and shows errors if not.
 */
function validateBookingForm() {
  let valid = true;

  // Helper to set or clear field error
  function setError(fieldId, errId, message) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errId);
    if (err)   err.textContent = message;
    if (field) field.classList.toggle('has-error', !!message);
    if (message) valid = false;
  }

  // Full Name — at least 2 chars
  const name = document.getElementById('fullName').value.trim();
  setError('fullName', 'err-fullName', name.length < 2 ? 'Please enter your full name.' : '');

  // Phone — Nigerian format (07x, 08x, 09x, or +234/234 prefix)
  const phone     = document.getElementById('phone').value.trim();
  const phoneOk   = /^(\+?234|0)[7-9][01]\d{8}$/.test(phone.replace(/\s/g, ''));
  setError('phone', 'err-phone', !phoneOk ? 'Enter a valid Nigerian phone number.' : '');

  // Service
  const service = document.getElementById('service').value;
  setError('service', 'err-service', !service ? 'Please select a service.' : '');

  // Date
  const date = document.getElementById('bdate').value;
  setError('bdate', 'err-bdate', !date ? 'Please choose a date.' : '');

  // Time
  const time = document.getElementById('btime').value;
  setError('btime', 'err-btime', !time ? 'Please select a time.' : '');

  return valid;
}

/**
 * Handle form submission:
 * 1. Validate
 * 2. Show loading state
 * 3. Brief delay (feels responsive)
 * 4. Show confirmation modal
 * 5. Auto-redirect to WhatsApp after countdown
 */
async function handleBookingSubmit(e) {
  e.preventDefault();

  if (!validateBookingForm()) return;

  // Collect form data
  const booking = {
    name:    document.getElementById('fullName').value.trim(),
    phone:   document.getElementById('phone').value.trim(),
    service: document.getElementById('service').value,
    date:    formatReadableDate(document.getElementById('bdate').value),
    time:    document.getElementById('btime').value,
    notes:   document.getElementById('notes').value.trim() || 'None'
  };

  // Show loading state
  setLoading(true);

  // Brief processing delay for UX feel
  await sleep(1400);

  setLoading(false);

  // Build WhatsApp message
  const waMessage = buildWhatsAppMessage(booking);
  const waURL     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  // Show confirmation modal
  showSuccessModal(booking, waURL);

  // Reset form immediately
  bookingForm.reset();
}

/**
 * Builds the professionally formatted WhatsApp message
 */
function buildWhatsAppMessage(b) {
  return [
    `✂️ *NEW J-CUTZ BOOKING*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `👤 *Name:* ${b.name}`,
    `📞 *Phone:* ${b.phone}`,
    `💈 *Service:* ${b.service}`,
    `📅 *Date:* ${b.date}`,
    `⏰ *Time:* ${b.time}`,
    `📝 *Notes:* ${b.notes}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `_Sent from J-Cutz website_`
  ].join('\n');
}

/**
 * Toggle loading state on submit button
 */
function setLoading(state) {
  if (!submitBtn) return;
  const text   = submitBtn.querySelector('.btn-text');
  const loader = submitBtn.querySelector('.btn-loading');
  submitBtn.disabled     = state;
  text.style.display     = state ? 'none'         : 'inline-flex';
  loader.style.display   = state ? 'inline-flex'  : 'none';
}

/**
 * Format ISO date string to readable format
 * "2026-05-20" → "May 20, 2026"
 */
function formatReadableDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-NG', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
}

// Promise-based sleep utility
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }


/* ============================================================
   6. SUCCESS MODAL — Shows booking summary + countdown to WA
   ============================================================ */
let countdownTimer;
let pendingWaURL = '';

function showSuccessModal(booking, waURL) {
  pendingWaURL = waURL;

  // Fill summary
  const summary = document.getElementById('modalSummary');
  if (summary) {
    summary.innerHTML = `
      <strong>📋 Booking Summary</strong><br/>
      <strong>Name:</strong> ${booking.name}<br/>
      <strong>Phone:</strong> ${booking.phone}<br/>
      <strong>Service:</strong> ${booking.service}<br/>
      <strong>Date:</strong> ${booking.date}<br/>
      <strong>Time:</strong> ${booking.time}
      ${booking.notes !== 'None' ? `<br/><strong>Notes:</strong> ${booking.notes}` : ''}
    `;
  }

  // Show modal
  const modal = document.getElementById('successModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Countdown: 3 → 2 → 1 → redirect
  let count = 3;
  const countEl = document.getElementById('countdown');
  if (countEl) countEl.textContent = count;

  countdownTimer = setInterval(() => {
    count--;
    if (countEl) countEl.textContent = count;
    if (count <= 0) {
      clearInterval(countdownTimer);
      redirectToWhatsApp();
    }
  }, 1000);

  // "Open Now" button
  const goBtn = document.getElementById('goToWhatsApp');
  if (goBtn) {
    goBtn.onclick = () => {
      clearInterval(countdownTimer);
      redirectToWhatsApp();
    };
  }

  // Cancel button
  const cancelBtn = document.getElementById('cancelWhatsApp');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      clearInterval(countdownTimer);
      closeModal();
    };
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      clearInterval(countdownTimer);
      closeModal();
    }
  });
}

function redirectToWhatsApp() {
  closeModal();
  if (pendingWaURL) {
    window.open(pendingWaURL, '_blank');
  }
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    clearInterval(countdownTimer);
    closeModal();
  }
});
