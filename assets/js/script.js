document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.page-loader');
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const backTop = document.querySelector('.back-top');
  const counters = document.querySelectorAll('[data-count]');

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

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
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

  const sections = [...document.querySelectorAll('main section[id], footer[id]')];
  const links = [...document.querySelectorAll('.main-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55%' });
  sections.forEach(section => sectionObserver.observe(section));
});
