const { renderPT } = require("./src/_includes/pt.js");

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
  eleventyConfig.addFilter("pt", (blocks) => renderPT(blocks));
  // Newest first (WP default order).
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("posts").sort((a, b) => b.date - a.date),
  );
  // WP the_excerpt() CJK mode: 55 chars + […]
  eleventyConfig.addFilter("excerpt", (html) => {
    const text = String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const points = [...text];
    return points.length <= 55 ? text : points.slice(0, 55).join("") + "[…]";
  });
  eleventyConfig.addFilter("wpdate", (iso) => (iso ? jst(iso, true) : ""));
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
