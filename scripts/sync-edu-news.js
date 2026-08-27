// Preia ultimele comunicate de presă de la edu.ro și le salvează static în assets/data/edu-ro-news.json.
// Rulat periodic de .github/workflows/sync-edu-news.yml (nu există RSS oficial la edu.ro).

const fs = require("fs");
const path = require("path");

const SOURCE_URL = "https://www.edu.ro/comunicate";
const OUTPUT_PATH = path.join(__dirname, "..", "assets", "data", "edu-ro-news.json");
const MAX_ITEMS = 6;

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, "");
}

async function main() {
  const res = await fetch(SOURCE_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; LiceulPanaitCernaBot/1.0)" },
  });
  if (!res.ok) {
    throw new Error(`edu.ro a răspuns cu status ${res.status}`);
  }
  const html = await res.text();

  const blocks = html.split('class="edu-teaser"').slice(1, MAX_ITEMS + 1);
  const items = blocks.map((block) => {
    const linkMatch = block.match(/<a href="([^"]+)"[^>]*rel="bookmark">\s*<span>([\s\S]*?)<\/span>\s*<\/a>/);
    const dateMatch = block.match(/edu-teaser__date">([^<]+)</);

    if (!linkMatch) return null;

    const href = linkMatch[1];
    const title = decodeEntities(stripTags(linkMatch[2]));
    const date = dateMatch ? decodeEntities(dateMatch[1]) : "";
    const url = href.startsWith("http") ? href : `https://www.edu.ro${href}`;

    return { title, url, date };
  }).filter(Boolean);

  if (items.length === 0) {
    throw new Error("Nu s-a găsit niciun comunicat — structura paginii edu.ro s-ar putea să se fi schimbat.");
  }

  const payload = {
    source: SOURCE_URL,
    fetchedAt: new Date().toISOString(),
    items,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Salvate ${items.length} comunicate în ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Eroare la sincronizarea știrilor edu.ro:", err.message);
  process.exit(1);
});
