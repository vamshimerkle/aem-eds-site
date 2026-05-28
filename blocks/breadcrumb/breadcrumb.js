export default function decorate(block) {
  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  const segments = path.split('/').filter(Boolean);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');

  // Home item
  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeLi.append(homeLink);
  ol.append(homeLi);

  // Build trail from URL segments
  let accumulated = '';
  segments.forEach((segment, index) => {
    accumulated += `/${segment}`;
    const li = document.createElement('li');
    const label = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    if (index === segments.length - 1) {
      li.setAttribute('aria-current', 'page');
      li.textContent = label;
    } else {
      const link = document.createElement('a');
      link.href = accumulated;
      link.textContent = label;
      li.append(link);
    }
    ol.append(li);
  });

  block.textContent = '';
  nav.append(ol);
  block.append(nav);
}
