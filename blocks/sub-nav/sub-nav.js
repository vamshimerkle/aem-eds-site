export default function decorate(block) {
  const rows = [...block.children];
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Sub navigation');
  nav.className = 'sub-nav-bar';

  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells[0];
    const linkCell = cells[1];

    const li = document.createElement('li');
    const link = linkCell?.querySelector('a');
    const title = titleCell?.textContent?.trim();

    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = title || link.textContent;
      if (a.href === window.location.href || a.pathname === window.location.pathname) {
        a.setAttribute('aria-current', 'page');
      }
      li.append(a);
    } else {
      li.textContent = title;
    }

    ul.append(li);
  });

  block.textContent = '';
  nav.append(ul);
  block.append(nav);
}
