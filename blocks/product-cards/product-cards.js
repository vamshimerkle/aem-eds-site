async function fetchContentFragment(cfpath) {
  const resp = await fetch(`${cfpath}.json`);
  if (!resp.ok) return null;
  return resp.json();
}

function isCFReference(row) {
  const firstCell = row.children[0];
  const link = firstCell?.querySelector('a');
  if (link) return link.href;
  const text = firstCell?.textContent?.trim();
  if (text?.startsWith('/content/dam/')) return text;
  return null;
}

function parseInlineRow(row) {
  const cells = [...row.children];
  const imageCell = cells[0];
  const bodyCell = cells[1];
  const ctaCell = cells[2];

  const img = imageCell?.querySelector('img');
  const title = bodyCell?.querySelector('h2, h3, strong, p:first-child')?.textContent?.trim()
    || bodyCell?.children[0]?.textContent?.trim() || '';
  const descEl = bodyCell?.querySelector('p:nth-child(2)') || bodyCell?.querySelector('p + p');
  const description = descEl?.textContent?.trim() || '';
  const ctaLink = ctaCell?.querySelector('a') || bodyCell?.querySelector('a');

  return {
    title,
    description,
    image: img?.src || '',
    ctapath: ctaLink?.href || '',
    ctaLabel: ctaLink?.textContent?.trim() || 'View Product',
  };
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  if (product.image) {
    const picture = document.createElement('div');
    picture.className = 'product-card-image';
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title || '';
    img.loading = 'lazy';
    picture.append(img);
    card.append(picture);
  }

  const body = document.createElement('div');
  body.className = 'product-card-body';

  if (product.title) {
    const title = document.createElement('h3');
    title.textContent = product.title;
    body.append(title);
  }

  if (product.description) {
    const desc = document.createElement('p');
    desc.textContent = product.description;
    body.append(desc);
  }

  if (product.ctapath) {
    const cta = document.createElement('a');
    cta.href = product.ctapath;
    cta.className = 'product-card-cta';
    cta.textContent = product.ctaLabel || 'View Product';
    body.append(cta);
  }

  card.append(body);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const products = [];

  const promises = rows.map(async (row) => {
    const cfpath = isCFReference(row);
    if (cfpath) {
      const cf = await fetchContentFragment(cfpath);
      if (cf) {
        return {
          title: cf.title || '',
          description: cf.description || '',
          image: cf.image || '',
          ctapath: cf.ctapath || '',
          ctaLabel: cf.ctaLabel || 'View Product',
        };
      }
      return null;
    }
    return parseInlineRow(row);
  });

  const results = await Promise.all(promises);
  results.forEach((product) => {
    if (product) products.push(product);
  });

  block.textContent = '';

  if (products.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'product-cards-empty';
    empty.textContent = 'No products to display.';
    block.append(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'product-cards-grid';

  products.forEach((product) => {
    grid.append(createProductCard(product));
  });

  block.append(grid);
}
