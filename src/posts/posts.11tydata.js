// Directory data for src/posts/*.md
// (frontmatter: title/date/slug/categories: [labels]/post_tags: [labels]).
const fs = require("fs");
const { slugify } = require("../_includes/slugify.js");

function termsOf(labels) {
  return (labels || []).map((label) => ({ slug: slugify(label), label }));
}

function jstParts(iso) {
  const dt = new Date(iso);
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(fmt.formatToParts(dt).map((p) => [p.type, p.value]));
  return { year: parts.year, month: parts.month };
}

function rawBody(inputPath) {
  try {
    const text = fs.readFileSync(inputPath, "utf8");
    const m = text.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    return m ? m[1] : "";
  } catch (e) {
    return "";
  }
}

function plainText(md) {
  return md
    .replace(/<!--.*?-->/gs, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(`+)(.*?)\1/g, "$2")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstImage(md) {
  let m = md.match(/<img[^>]+src="([^"]+)"/);
  if (m) return m[1];
  m = md.match(/!\[[^\]]*\]\((https?:[^)\s]+)\)/);
  return m ? m[1] : "";
}

module.exports = {
  tags: ["posts"],
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) => {
      const { year, month } = jstParts(data.date);
      return `/${year}/${month}/${data.slug}/`;
    },
    year: (data) => jstParts(data.date).year,
    month: (data) => jstParts(data.date).month,
    og_type: () => "article",
    og_description: (data) => {
      const points = [...plainText(rawBody(data.page.inputPath))];
      return points.length <= 140 ? points.join("") : points.slice(0, 140).join("");
    },
    og_image: (data) => firstImage(rawBody(data.page.inputPath)),
    categories: (data) => termsOf(data.categories),
    post_tags: (data) => termsOf(data.post_tags),
    related: (data) => {
      const slugs = (terms) => (terms || []).map((t) => (typeof t === "string" ? slugify(t) : t.slug));
      const cats = new Set(slugs(data.categories));
      const tags = new Set(slugs(data.post_tags));
      return (data.collections.posts || [])
        .filter((q) => q.data.slug !== data.slug)
        .map((q) => ({
          post: q,
          score:
            slugs(q.data.post_tags).filter((s) => tags.has(s)).length * 2 +
            slugs(q.data.categories).filter((s) => cats.has(s)).length,
        }))
        .filter((r) => r.score >= 2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((r) => ({ url: r.post.url, title: r.post.data.title }));
    },
  },
};
