#!/usr/bin/env python3
"""Rebuild src/taxonomies.yml (Decap candidate lists) from post frontmatter.

Usage: python3 scripts/gen-taxonomies.py
Merges existing entries (keeps hand-added terms) with terms found in posts.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAX = ROOT / "src" / "taxonomies.yml"


def frontmatter_lists(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        return [], [], [], []
    fm = m.group(1)
    out = {}
    for key in ("categories", "post_tags", "new_categories", "new_tags"):
        items = []
        in_list = False
        for line in fm.splitlines():
            if re.match(rf"^{key}:\s*(\[\])?\s*$", line):
                in_list = True
                continue
            if in_list:
                item = re.match(r"^\s+-\s+(.*)$", line)
                if item:
                    items.append(item.group(1).strip().strip('"'))
                    continue
                if line.strip() and not line.startswith(" "):
                    break
        out[key] = items
    return out["categories"], out["post_tags"], out["new_categories"], out["new_tags"]


def read_existing():
    if not TAX.exists():
        return {"categories": [], "tags": []}
    text = TAX.read_text(encoding="utf-8")
    out, cur = {"categories": [], "tags": []}, None
    for line in text.splitlines():
        if line == "categories:":
            cur = "categories"
        elif line == "tags:":
            cur = "tags"
        elif cur and (m := re.match(r"^\s+-\s+(.*)$", line)):
            out[cur].append(m.group(1).strip().strip('"'))
    return out


existing = read_existing()
cats, tags = set(existing["categories"]), set(existing["tags"])
for md in (ROOT / "src" / "posts").glob("*.md"):
    c, t, nc, nt = frontmatter_lists(md)
    cats.update(c)
    tags.update(t)
    cats.update(nc)
    tags.update(nt)
TAX.write_text(
    "categories:\n"
    + "".join(f'  - "{c}"\n' for c in sorted(cats))
    + "tags:\n"
    + "".join(f'  - "{t}"\n' for t in sorted(tags))
    + "",
    encoding="utf-8",
)
(ROOT / "static" / "admin" / "taxonomies.json").write_text(
    json.dumps({"categories": sorted(cats), "tags": sorted(tags)}, ensure_ascii=False), encoding="utf-8"
)
print(f"categories={len(cats)} tags={len(tags)} -> {TAX}")
