#!/usr/bin/env python3
"""Export local EmDash D1 content to JSON for the 11ty PoC (read-only).

Usage: python3 scripts/export-11ty.py
Reads .wrangler/.../*.sqlite (mode=ro), writes src/_data/*.json.
"""
import json
import sqlite3
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
DB = next((ROOT / ".wrangler/state/v3/d1/miniflare-D1DatabaseObject").glob("e*.sqlite"))
OUT = ROOT / "src" / "_data"
JST = timezone(timedelta(hours=9))

con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
con.row_factory = sqlite3.Row
cur = con.cursor()


def opt(name):
    row = cur.execute("SELECT value FROM options WHERE name=?", (name,)).fetchone()
    return json.loads(row["value"]) if row else None


def jst_parts(iso):
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(JST)
    return dt.strftime("%Y"), dt.strftime("%m"), dt.strftime("%d"), dt.strftime("%H:%M")


def terms(entry_id):
    rows = cur.execute(
        """SELECT t.name, t.slug, t.label FROM content_taxonomies ct
           JOIN taxonomies t ON t.id = ct.taxonomy_id
           WHERE ct.entry_id=? AND ct.deleted_at IS NULL""",
        (entry_id,),
    ).fetchall()
    # Migration stored percent-encoded slugs; WP originals are raw UTF-8.
    cats = [{"slug": unquote(r["slug"]), "label": r["label"]} for r in rows if r["name"] == "category"]
    tags = [{"slug": unquote(r["slug"]), "label": r["label"]} for r in rows if r["name"] == "tag"]
    return cats, tags


def plain_text(blocks):
    parts = []
    for b in blocks or []:
        if b.get("_type") == "block":
            parts.append("".join(c.get("text", "") for c in b.get("children", [])))
    return " ".join(" ".join(parts).split())


def excerpt_of(blocks, chars=55):
    text = plain_text(blocks)
    points = list(text)
    return text if len(points) <= chars else "".join(points[:chars]) + "[…]"


posts = []
for r in cur.execute(
    "SELECT id,slug,title,published_at,content FROM ec_posts"
    " WHERE deleted_at IS NULL AND status='published' AND published_at IS NOT NULL"
    " ORDER BY published_at DESC"
).fetchall():
    y, m, d, hm = jst_parts(r["published_at"])
    cats, tags = terms(r["id"])
    blocks = json.loads(r["content"]) if r["content"] else []
    slug = unquote(r["slug"])
    posts.append(
        {
            "slug": slug,
            "url": f"/{y}/{m}/{slug}/",
            "title": r["title"],
            "date": f"{y}-{m}-{d} {hm}",
            "year": y,
            "month": m,
            "categories": cats,
            "tags": tags,
            "excerpt": excerpt_of(blocks),
            "content": blocks,
        }
    )

pages = []
for r in cur.execute(
    "SELECT slug,title,content FROM ec_pages WHERE deleted_at IS NULL AND status='published'"
).fetchall():
    pages.append(
        {"slug": r["slug"], "title": r["title"], "content": json.loads(r["content"]) if r["content"] else []}
    )

menu = [
    {"label": r["label"], "url": r["custom_url"]}
    for r in cur.execute(
        "SELECT label,custom_url FROM _emdash_menu_items WHERE menu_id="
        "(SELECT id FROM _emdash_menus WHERE name='primary') ORDER BY sort_order"
    ).fetchall()
]

about = cur.execute(
    "SELECT w.title,w.content FROM _emdash_widgets w"
    " JOIN _emdash_widget_areas a ON a.id=w.area_id"
    " WHERE w.type='content' AND a.name='sidebar' ORDER BY w.sort_order LIMIT 1"
).fetchone()

cat_counts = Counter()
month_counts = Counter()
for p in posts:
    for c in p["categories"]:
        cat_counts[(c["slug"], c["label"])] += 1
    month_counts[(p["year"], p["month"])] += 1
year_counts = Counter(p["year"] for p in posts)

tag_counts = Counter()
for p in posts:
    for t in p["tags"]:
        tag_counts[(t["slug"], t["label"])] += 1

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "site.json").write_text(
    json.dumps(
        {
            "title": opt("site:title"),
            "tagline": opt("site:tagline"),
            "url": "https://blog.monora.me",
            "menu": menu,
            "about": {"title": about["title"], "content": json.loads(about["content"])} if about else None,
            "recent": [
                {"slug": p["slug"], "url": p["url"], "title": p["title"], "date": p["date"][:10]}
                for p in posts[:5]
            ],
            "categories": [
                {"slug": s, "label": lb, "count": n} for (s, lb), n in sorted(cat_counts.items())
            ],
            "tags": [
                {"slug": s, "label": lb, "count": n} for (s, lb), n in sorted(tag_counts.items())
            ],
            "years": [{"year": y, "count": n} for y, n in sorted(year_counts.items(), reverse=True)],
            "months": [
                {"year": y, "month": m, "label": f"{y}年{int(m)}月", "count": n}
                for (y, m), n in sorted(month_counts.items(), reverse=True)
            ],
        },
        ensure_ascii=False,
        indent=2,
    )
    + "\n"
)
(OUT / "posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=2) + "\n")
(OUT / "pages.json").write_text(json.dumps(pages, ensure_ascii=False, indent=2) + "\n")
print(f"posts={len(posts)} pages={len(pages)} -> {OUT}")
