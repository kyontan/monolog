// Directory data for src/posts/*.md
// (frontmatter: title/date/slug/categories: [labels]/post_tags: [labels]).
const { slugify } = require("../_includes/slugify.js");

function termsOf(labels) {
  return (labels || []).map((label) => ({ slug: slugify(label), label }));
}

// Merge relation-picked terms with free-entry new_* terms (dedupe by slug).
function mergedTerms(data, base, extra) {
  const seen = new Map();
  for (const label of [...(data[base] || []), ...(data[extra] || [])]) {
    const t = typeof label === "string" ? { slug: slugify(label), label } : label;
    if (!seen.has(t.slug)) seen.set(t.slug, t.label);
  }
  return [...seen.entries()].map(([slug, label]) => ({ slug, label }));
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
    categories: (data) => mergedTerms(data, "categories", "new_categories"),
    post_tags: (data) => mergedTerms(data, "post_tags", "new_tags"),
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
