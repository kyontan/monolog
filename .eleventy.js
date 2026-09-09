const { renderPT } = require("./src/_includes/pt.js");
const { slugify } = require("./src/_includes/slugify.js");

function jst(iso, withTime) {
  const dt = new Date(iso);
  const fmt = (o) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", ...o });
  const d = Object.fromEntries(
    fmt({ year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(dt).map((p) => [p.type, p.value]),
  );
  if (!withTime) return `${d.year}-${d.month}-${d.day}`;
  const t = Object.fromEntries(
    fmt({ hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(dt).map((p) => [p.type, p.value]),
  );
  return `${d.year}-${d.month}-${d.day} ${t.hour}:${t.minute}`;
}

module.exports = function (eleventyConfig) {
  // Decap editing data, not site content.
  eleventyConfig.ignores.add("src/taxonomies.yml");  eleventyConfig.addFilter("pt", (blocks) => renderPT(blocks));
  // Newest first (WP default order).
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("posts").sort((a, b) => b.date - a.date),
  );

  // Sidebar + archive indexes derived from content (no export-time data).
  function terms(posts, key) {
    const counts = new Map();
    for (const p of posts) {
      for (const t of p.data[key] || []) {
        const label = typeof t === "string" ? t : t.label;
        const slug = typeof t === "string" ? slugify(t) : t.slug;
        counts.set(slug, { slug, label, count: (counts.get(slug)?.count ?? 0) + 1 });
      }
    }
    return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label, "ja"));
  }
  eleventyConfig.addCollection("catList", (api) =>
    terms(api.getFilteredByTag("posts"), "categories"),
  );
  eleventyConfig.addCollection("tagList", (api) =>
    terms(api.getFilteredByTag("posts"), "post_tags"),
  );
  eleventyConfig.addCollection("yearList", (api) => {
    const counts = new Map();
    for (const p of api.getFilteredByTag("posts")) {
      counts.set(p.data.year, (counts.get(p.data.year) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([year, count]) => ({ year, count }));
  });
  eleventyConfig.addCollection("monthList", (api) => {
    const counts = new Map();
    for (const p of api.getFilteredByTag("posts")) {
      const key = `${p.data.year}/${p.data.month}`;
      counts.set(key, { year: p.data.year, month: p.data.month, count: (counts.get(key)?.count ?? 0) + 1 });
    }
    return [...counts.values()]
      .sort((a, b) => `${b.year}/${b.month}`.localeCompare(`${a.year}/${a.month}`))
      .map((m) => ({ ...m, label: `${m.year}年${Number(m.month)}月` }));
  });
  // WP the_excerpt() CJK mode: 55 chars + […]
  eleventyConfig.addFilter("excerpt", (html) => {
    const text = String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const points = [...text];
    return points.length <= 55 ? text : points.slice(0, 55).join("") + "[…]";
  });
  eleventyConfig.addFilter("wpdate", (iso, dateOnly) =>
    iso ? jst(iso, !dateOnly) : "",
  );
  // WP the_content('read more »') on list pages: cut at the more anchor.
  eleventyConfig.addFilter("more", (html, url, slug) => {
    const parts = String(html || "").split(`<span id="more-${slug}"></span>`);
    if (parts.length < 2) return html;
    return (
      parts[0] +
      `<p><a href="${url}#more-${slug}" class="more-link">read more <span class="meta-nav">»</span></a></p>`
    );
  });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "static/admin": "admin" });
  eleventyConfig.addPassthroughCopy("src/CNAME");
  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
  };
};
