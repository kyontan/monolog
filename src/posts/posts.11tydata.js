// Directory data for 11ty/src/posts/*.md (frontmatter: title/date/slug/categories/post_tags).
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
    related: (data) => {
      const cats = new Set((data.categories || []).map((c) => c.slug));
      const tags = new Set((data.post_tags || []).map((t) => t.slug));
      return (data.collections.posts || [])
        .filter((q) => q.data.slug !== data.slug)
        .map((q) => ({
          post: q,
          score:
            (q.data.post_tags || []).filter((t) => tags.has(t.slug)).length * 2 +
            (q.data.categories || []).filter((c) => cats.has(c.slug)).length,
        }))
        .filter((r) => r.score >= 2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((r) => ({ url: r.post.url, title: r.post.data.title }));
    },
  },
};
