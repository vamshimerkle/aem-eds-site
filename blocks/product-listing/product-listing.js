async function fetchProductIndex() {
  const resp = await fetch('/query-index.json');
  if (!resp.ok) return [];
  const { data } = await resp.json();
  return data || [];
}

function filterByTag(products, tag) {
  const normalizedTag = tag.toLowerCase().trim();
  return products.filter((product) => {
    const tags = (product.tags || '').toLowerCase();
    return tags.split(',').some((t) => t.trim() === normalizedTag);
  });
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

  const title = document.createElement('h3');
  title.textContent = product.title || '';
  body.append(title);

  if (product.description) {
    const desc = document.createElement('p');
    desc.textContent = product.description;
    body.append(desc);
  }

  if (product.ctapath || product.path) {
    const cta = document.createElement('a');
    cta.href = product.ctapath || product.path;
    cta.className = 'product-card-cta';
    cta.textContent = 'View Product';
    body.append(cta);
  }

  card.append(body);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const tag = rows[0]?.textContent?.trim();

  if (!tag) {
    block.textContent = 'No tag specified for product listing.';
    return;
  }

  block.textContent = '';

  const loading = document.createElement('p');
  loading.className = 'product-listing-loading';
  loading.textContent = 'Loading products...';
  block.append(loading);

  const allProducts = await fetchProductIndex();
  const filtered = filterByTag(allProducts, tag);

  block.textContent = '';

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'product-listing-empty';
    empty.textContent = `No products found for "${tag}".`;
    block.append(empty);
    return;
  }

  const tagHeading = document.createElement('h2');
  tagHeading.className = 'product-listing-heading';
  tagHeading.textContent = tag;
  block.append(tagHeading);

  const grid = document.createElement('div');
  grid.className = 'product-listing-grid';

  filtered.forEach((product) => {
    grid.append(createProductCard(product));
  });

  block.append(grid);
}
