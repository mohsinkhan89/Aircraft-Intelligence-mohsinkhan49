document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.page-loader');
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const backTop = document.querySelector('.back-top');
  const counters = document.querySelectorAll('[data-count]');
  const contactForm = document.querySelector('#contact-form');

  window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 260));

  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  const onScroll = () => {
    header.classList.toggle('sticky', window.scrollY > 180);
    backTop.classList.toggle('show', window.scrollY > 650);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const animatedText = document.querySelectorAll([
    '.hero h1', '.hero-copy', '.promise',
    '.service-card h2', '.service-card p', '.service-card a',
    '.why-copy .kicker', '.why-copy h2', '.why-copy > p',
    '.feature-content h3', '.feature-content p',
    '.cta-inner h2', '.cta-inner > div:first-child p',
    '.contact-card p', '.footer-grid h4',
    '.contact-heading h2', '.contact-heading > p',
    '.contact-panel h3', '.contact-panel-copy', '.form-intro h3'
  ].join(','));
  animatedText.forEach((element, index) => {
    element.classList.add('text-reveal');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal, .text-reveal').forEach((el, index) => {
    if (el.classList.contains('reveal')) {
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    }
    revealObserver.observe(el);
  });

  let counted = false;
  const countObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting) || counted) return;
    counted = true;
    counters.forEach(counter => {
      const target = Number(counter.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    countObserver.disconnect();
  }, { threshold: .35 });
  countObserver.observe(document.querySelector('.trust-strip'));

  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const status = document.querySelector('#form-status');
      const subject = `Aircraft inquiry: ${data.get('service')}`;
      const body = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Phone: ${data.get('phone') || 'Not provided'}`,
        `Service: ${data.get('service')}`,
        '',
        String(data.get('message'))
      ].join('\n');

      status.textContent = 'Your email application is opening with the inquiry details prepared.';
      status.classList.add('show');
      window.location.href = `mailto:info@aeromaxusa.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const sections = [...document.querySelectorAll('main section[id]:not(#contact-cta), footer[id]')];
  const links = [...document.querySelectorAll('.main-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55%' });
  sections.forEach(section => sectionObserver.observe(section));
});
