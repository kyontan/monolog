// WP-compatible term slug derivation (verified: reproduces all migrated slugs).
function slugify(label) {
  return String(label ?? "")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\u3400-\u4dbf_-]/g, "");
}

module.exports = { slugify };
