const metaEl = document.getElementById("gallery-meta");
const galleryEl = document.getElementById("asset-gallery");

function tagLabel(tags = []) {
  if (!Array.isArray(tags) || !tags.length) return "";
  return tags.slice(0, 3).join(" · ");
}

function buildCard(item) {
  const card = document.createElement("article");
  card.className = "asset-card";

  const header = document.createElement("header");
  header.className = "asset-card-header";
  header.innerHTML = `
    <div>
      <h2>${item.label}</h2>
      <p>${tagLabel(item.tags)}</p>
    </div>
    <span>${item.type}</span>
  `;

  const strip = document.createElement("div");
  strip.className = "asset-strip";
  for (const view of (item.views || [])) {
    const figure = document.createElement("figure");
    figure.className = "asset-view";
    figure.innerHTML = `
      <img loading="lazy" src="./${view.image}" alt="${item.label} ${view.name}" />
      <figcaption>${view.name}</figcaption>
    `;
    strip.appendChild(figure);
  }

  card.appendChild(header);
  if (item.description) {
    const copy = document.createElement("p");
    copy.className = "asset-card-copy";
    copy.textContent = item.description;
    card.appendChild(copy);
  }
  if (item.source_object_id) {
    const meta = document.createElement("p");
    meta.className = "asset-card-copy";
    meta.textContent = `Source: ${item.source_object_id}`;
    card.appendChild(meta);
  }
  card.appendChild(strip);
  return card;
}

async function bootstrap() {
  try {
    const response = await fetch("./asset-previews/manifest.json");
    if (!response.ok) throw new Error(`manifest fetch failed: ${response.status}`);
    const manifest = await response.json();
    metaEl.textContent = `${manifest.count || 0} isolated city elements · generated ${manifest.generated_at || "-"}`;
    galleryEl.innerHTML = "";
    for (const item of (manifest.items || [])) {
      galleryEl.appendChild(buildCard(item));
    }
  } catch (error) {
    metaEl.textContent = "Failed to load asset previews.";
    console.error(error);
  }
}

bootstrap();
