/** Minimal Portable Text renderer for the 11ty PoC. Covers the block types
 *  present in migrated content: block, image, code, break, htmlBlock, embed,
 *  columns, gallery. Marks: strong, em, code, strike-through, underline,
 *  superscript, link. Unknown nodes render children only (never lost). */
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMark(mark, markDefs, inner) {
  if (typeof mark === "string") {
    switch (mark) {
      case "strong": return `<strong>${inner}</strong>`;
      case "em": return `<em>${inner}</em>`;
      case "code": return `<code>${inner}</code>`;
      case "strike-through": return `<s>${inner}</s>`;
      case "underline": return `<span style="text-decoration: underline;">${inner}</span>`;
      case "superscript": return `<sup>${inner}</sup>`;
      case "subscript": return `<sub>${inner}</sub>`;
      default: {
        const def = (markDefs || []).find((d) => d._key === mark);
        if (def && def._type === "link" && def.href) {
          return `<a href="${esc(def.href)}">${inner}</a>`;
        }
        return inner;
      }
    }
  }
  return inner;
}

function renderSpan(span, markDefs) {
  let html = esc(span.text);
  for (const mark of span.marks || []) html = renderMark(mark, markDefs, html);
  return html;
}

function renderChildren(block) {
  return (block.children || []).map((c) => {
    if (c._type === "span") return renderSpan(c, block.markDefs);
    if (c.text) return esc(c.text);
    return "";
  }).join("");
}

function imgSrc(img) {
  return (img.asset && img.asset.url) || img.url || "";
}

function renderNode(node) {
  if (!node || typeof node !== "object") return "";
  switch (node._type) {
    case "block": {
      const inner = renderChildren(node);
      switch (node.style) {
        case "h1": return `<h1>${inner}</h1>`;
        case "h2": return `<h2>${inner}</h2>`;
        case "h3": return `<h3>${inner}</h3>`;
        case "h4": return `<h4>${inner}</h4>`;
        case "h5": return `<h5>${inner}</h5>`;
        case "h6": return `<h6>${inner}</h6>`;
        case "blockquote": return `<blockquote>${inner}</blockquote>`;
        default: return `<p>${inner}</p>`;
      }
    }
    case "image": {
      const src = imgSrc(node);
      if (!src) return "";
      const alt = esc(node.alt || "");
      const cap = node.caption ? `<figcaption class="gallery-caption">${esc(node.caption)}</figcaption>` : "";
      return cap
        ? `<figure class="wp-caption"><img src="${esc(src)}" alt="${alt}">${cap}</figure>`
        : `<p><img src="${esc(src)}" alt="${alt}"></p>`;
    }
    case "code":
      return `<pre><code>${esc(node.code || node.text || "")}</code></pre>`;
    case "break":
      return `<br>`;
    case "htmlBlock":
      return node.html || "";
    case "embed":
      return node.url ? `<p><a href="${esc(node.url)}">${esc(node.url)}</a></p>` : "";
    case "columns":
      return `<div>${(node.columns || []).map((col) => `<div>${renderPT(col.blocks || col)}</div>`).join("")}</div>`;
    case "gallery":
      return `<div class="gallery">${(node.images || []).map((img) => {
        const src = imgSrc(img);
        if (!src) return "";
        const cap = img.caption ? `<figcaption class="gallery-caption">${esc(img.caption)}</figcaption>` : "";
        return `<figure class="gallery-item"><img src="${esc(src)}" alt="${esc(img.alt || "")}" loading="lazy">${cap}</figure>`;
      }).join("")}</div>`;
    default:
      // Lists and anything else: render children so no text is lost.
      if (Array.isArray(node.children)) return renderChildren(node);
      return "";
  }
}

function renderListItem(block) {
  return `<li>${renderChildren(block)}</li>`;
}

function renderPT(blocks) {
  if (!Array.isArray(blocks)) return "";
  let html = "";
  let openList = null; // 'bullet' | 'number'
  const closeList = () => {
    if (openList) {
      html += openList === "number" ? "</ol>" : "</ul>";
      openList = null;
    }
  };
  for (const node of blocks) {
    if (node && node._type === "block" && node.listItem) {
      const kind = node.listItem === "number" ? "number" : "bullet";
      if (openList !== kind) {
        closeList();
        html += kind === "number" ? "<ol>" : "<ul>";
        openList = kind;
      }
      html += renderListItem(node);
    } else {
      closeList();
      html += renderNode(node);
    }
  }
  closeList();
  return html;
}

module.exports = { renderPT, esc };
