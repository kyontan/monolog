#!/usr/bin/env python3
"""Upload referenced media to local RustFS (read D1 never, download via EmDash).

Usage: python3 scripts/upload-media.py
Reads /tmp/media-manifest.json (from convert-md.py), downloads each file
from the local EmDash dev server, stages to /tmp/media-stage/, then mirrors
to the `monolog-media` bucket with `mc`.
Requires: EmDash dev on :4321, rustfs on :9000, `mc` with a working alias.
"""
import json
import os
import subprocess
import urllib.request
from pathlib import Path

EMDASH = "http://localhost:4321"
ENDPOINT = "http://127.0.0.1:9000"
BUCKET = "monolog-media"
STAGE = Path("/tmp/media-stage")

manifest = json.loads(Path("/tmp/media-manifest.json").read_text())
STAGE.mkdir(exist_ok=True)
ok, failed = 0, []
for item in manifest:
    dest = STAGE / item["key"]
    if dest.exists():
        ok += 1
        continue
    try:
        with urllib.request.urlopen(EMDASH + item["src"], timeout=60) as r:
            dest.write_bytes(r.read())
        ok += 1
    except Exception as e:  # noqa: BLE001 - report and continue
        failed.append((item["src"], str(e)))
print(f"staged {ok}/{len(manifest)}, failed {len(failed)}")
for src, err in failed[:10]:
    print("FAIL", src, err)

env = {
    **os.environ,
    "AWS_ACCESS_KEY_ID": os.environ["RUSTFS_ACCESS_KEY"],
    "AWS_SECRET_ACCESS_KEY": os.environ["RUSTFS_SECRET_KEY"],
    "AWS_EC2_METADATA_DISABLED": "true",
}
r = subprocess.run(
    ["aws", "--endpoint-url", ENDPOINT, "s3", "sync", str(STAGE), f"s3://{BUCKET}"],
    capture_output=True,
    text=True,
    env=env,
)
print((r.stdout or "")[-300:])
print((r.stderr or "")[-300:])
