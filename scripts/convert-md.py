#!/usr/bin/env python3
"""Portable Text (export JSON) -> Markdown files for Decap/11ty.

Usage: MEDIA_BASE=https://media.example.com python3 scripts/convert-md.py
Reads src/_data/posts.json + pages.json, writes src/posts/*.md and src/pages/*.md.

- code blocks -> fenced blocks (entities unescaped, no language: source has none)
- gallery / captioned images -> raw HTML figure (keeps .gallery CSS)
- break -> <br>, htmlBlock -> raw, embed -> autolink, columns -> flattened
- media /_emdash/api/media/file/<id>.<ext> -> {MEDIA_BASE}/{filename}
  (id-prefixed when the filename is not unique)
"""
import html
import json
import os
import re
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "_data"
POSTS_DIR = ROOT / "src" / "posts"
PAGES_DIR = ROOT / "src" / "pages"
MEDIA_BASE = os.environ.get("MEDIA_BASE", "https://monora-monolog-media.1line.dev").rstrip("/")

con = sqlite3.connect(
    f"file:{next((ROOT / '.wrangler/state/v3/d1/miniflare-D1DatabaseObject').glob('e*.sqlite'))}?mode=ro",
    uri=True,
)
# PT asset refs carry the storage_key (not the media id).
media = {}
dups = set()
seen = set()
for mid, fn, skey in con.execute("SELECT id,filename,storage_key FROM media"):
    if fn in seen:
        dups.add(fn)
    seen.add(fn)
    media[skey] = fn


def media_key(ref):
    """Local media ref -> S3 object key (or the original ref if unknown)."""
    m = re.search(r"/_emdash/api/media/file/([A-Za-z0-9._-]+)", ref or "")
    if not m:
        return ref
    fn = media.get(m.group(1))
    if not fn:
        return ref
    return f"{m.group(1).split('.')[0]}-{fn}" if fn in dups else fn


def media_url(ref):
    key = media_key(ref)
    return f"{MEDIA_BASE}/{key}" if key != ref else ref


def render_span(text, marks, mark_defs):
    for mark in marks or []:
        if mark == "strong":
            text = f"**{text}**"
        elif mark == "em":
            text = f"*{text}*"
        elif mark == "code":
            text = f"`{text}`"
        elif mark == "strike-through":
            text = f"~~{text}~~"
        elif mark == "underline":
            text = f"<u>{text}</u>"
        elif mark == "superscript":
            text = f"<sup>{text}</sup>"
        elif mark == "subscript":
            text = f"<sub>{text}</sub>"
        else:
            link = next((d for d in mark_defs if d.get("_key") == mark and d.get("_type") == "link"), None)
            if link:
                text = f"[{text}]({link['href']})"
    return text


def children_md(block):
    return "".join(
        render_span(c.get("text", ""), c.get("marks"), block.get("markDefs")) for c in block.get("children", [])
    )


def image_md(img):
    src = media_url((img.get("asset") or {}).get("url") or img.get("url") or "")
    alt = img.get("alt") or ""
    if img.get("caption"):
        return (
            f'<figure class="gallery-item"><img src="{src}" alt="{alt}" loading="lazy">'
            f'<figcaption class="gallery-caption">{img["caption"]}</figcaption></figure>'
        )
    return f"![{alt}]({src})"


def blocks_md(blocks, slug="", state=None):
    state = state if state is not None else {"more_seen": False}
    out = []
    open_list = None
    for b in blocks or []:
        if b.get("_type") == "block" and b.get("listItem"):
            kind = "ol" if b["listItem"] == "number" else "ul"
            level = (b.get("level") or 1) - 1
            prefix = "  " * level + ("1. " if kind == "ol" else "- ")
            if open_list != (kind, level):
                if open_list:
                    out.append("")
                open_list = (kind, level)
            out.append(prefix + children_md(b))
            continue
        open_list = None
        t = b.get("_type")
        if t == "block":
            text = children_md(b)
            style = b.get("style") or "normal"
            if style == "normal":
                out.append(text)
            elif style == "blockquote":
                out.append("> " + text.replace("\n", "\n> "))
            else:
                depth = {"h1": 1, "h2": 2, "h3": 3, "h4": 4, "h5": 5}.get(style, 2)
                out.append("#" * depth + " " + text)
        elif t == "image":
            out.append(image_md(b))
        elif t == "code":
            out.append("```\n" + html.unescape(b.get("code") or b.get("text") or "") + "\n```")
        elif t == "break":
            # <!--more--> conversion: first one becomes the split anchor,
            # the rest are dropped (WP ignores them too).
            if not state["more_seen"]:
                state["more_seen"] = True
                out.append(f'<span id="more-{slug}"></span>')
            continue
        elif t == "htmlBlock":
            out.append(b.get("html") or "")
        elif t == "embed":
            out.append(f"<{b['url']}>" if b.get("url") else "")
        elif t == "columns":
            for col in b.get("columns") or []:
                out.append(blocks_md(col if isinstance(col, list) else col.get("blocks") or [], slug, state))
        elif t == "gallery":
            figs = "".join(
                f'<figure class="gallery-item"><img src="{media_url((i.get("asset") or {}).get("url") or i.get("url") or "")}"'
                f' alt="{i.get("alt") or ""}" loading="lazy">'
                + (f'<figcaption class="gallery-caption">{i["caption"]}</figcaption>' if i.get("caption") else "")
                + "</figure>"
                for i in b.get("images") or []
            )
            out.append(f'<div class="gallery">{figs}</div>')
    return "\n\n".join(p for p in out if p is not None)


def frontmatter(data):
    lines = ["---"]
    lines.append(f"title: {json.dumps(data['title'], ensure_ascii=False)}")
    lines.append(f"date: {data['date']}")
    lines.append(f"slug: {json.dumps(data['slug'], ensure_ascii=False)}")
    for key in ("categories", "post_tags"):
        items = data.get(key) or []
        if not items:
            lines.append(f"{key}: []")
            continue
        lines.append(f"{key}:")
        # Label-only: slugs derive at build time (WP-compatible rule).
        for t in items:
            label = t["label"] if isinstance(t, dict) else t
            lines.append(f"  - {json.dumps(label, ensure_ascii=False)}")
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def main():
    from datetime import datetime, timedelta, timezone

    jst = timezone(timedelta(hours=9))
    posts = json.loads((DATA / "posts.json").read_text())
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    for p in posts:
        y, m, slug = p["year"], p["month"], p["slug"]
        dt = datetime.fromisoformat(p["date"].replace(" ", "T") + ":00+09:00")
        body = frontmatter(
            {
                "title": p["title"],
                "date": dt.isoformat(),
                "slug": slug,
                "categories": p["categories"],
                "post_tags": p["tags"],
                "related": p.get("related") or [],
            }
        ) + blocks_md(p["content"], slug) + "\n"
        (POSTS_DIR / f"{slug}.md").write_text(body, encoding="utf-8")

    pages = json.loads((DATA / "pages.json").read_text())
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    for pg in pages:
        if not pg["content"]:
            continue
        body = f"---\ntitle: {json.dumps(pg['title'], ensure_ascii=False)}\nslug: {pg['slug']}\n---\n\n" + blocks_md(pg["content"], pg["slug"]) + "\n"
        (PAGES_DIR / f"{pg['slug']}.md").write_text(body, encoding="utf-8")
    print(f"wrote {len(posts)} posts, {len([p for p in pages if p['content']])} pages")

    # Media manifest for upload-media: every local media ref -> target key.
    # (collected from source JSON: md already carries rewritten absolute URLs)
    def walk_refs(blocks):
        for b in blocks or []:
            if not isinstance(b, dict):
                continue
            for k in ("asset",):
                url = (b.get(k) or {}).get("url") if isinstance(b.get(k), dict) else None
                if url and url.startswith("/_emdash/"):
                    yield url
            if isinstance(b.get("url"), str) and b["url"].startswith("/_emdash/"):
                yield b["url"]
            yield from walk_refs(b.get("children") or [])
            yield from walk_refs(b.get("images") or [])
            cols = b.get("columns")
            if isinstance(cols, list):
                for col in cols:
                    yield from walk_refs(col if isinstance(col, list) else col.get("blocks") or [])

    seen_keys = {}
    for p in posts:
        for ref in walk_refs(p["content"]):
            key = media_key(ref)
            if key != ref:
                seen_keys[ref] = key
    manifest = [{"src": src, "key": key} for src, key in sorted(seen_keys.items())]
    Path("/tmp/media-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
    print(f"manifest: {len(manifest)} refs -> /tmp/media-manifest.json")


if __name__ == "__main__":
    main()
