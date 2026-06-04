const MIN_ITEMS = 2;
const MAX_ITEMS = 6;

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < MIN_ITEMS || rows.length > MAX_ITEMS) {
    block.textContent = '';
    const msg = document.createElement('p');
    msg.textContent = `Accordion requires between ${MIN_ITEMS} and ${MAX_ITEMS} items. Found ${rows.length}.`;
    msg.style.color = 'red';
    block.append(msg);
    return;
  }

  const dl = document.createElement('dl');
  dl.className = 'accordion-list';

  rows.forEach((row) => {
    const question = row.children[0]?.textContent.trim();
    const answer = row.children[1];

    const dt = document.createElement('dt');
    const button = document.createElement('button');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = question;
    dt.append(button);

    const dd = document.createElement('dd');
    dd.hidden = true;
    if (answer) {
      dd.innerHTML = answer.innerHTML;
    }

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      dd.hidden = expanded;
    });

    dl.append(dt, dd);
  });

  block.textContent = '';
  block.append(dl);
}
