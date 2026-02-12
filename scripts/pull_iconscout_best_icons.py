"""
Pull best-matching 3D PNG icons from Iconscout pages.

This script:
1) Fetches Iconscout search/listing pages through r.jina.ai mirror.
2) Extracts candidate CDN PNG URLs.
3) Scores candidates by concept keywords.
4) Downloads the best icon for each concept into src/assets/icons3d.
"""

from __future__ import annotations

import argparse
import os
import re
import ssl
import urllib.error
import urllib.request
from dataclasses import dataclass


PNG_RE = re.compile(r"https://cdn3d\.iconscout\.com/3d/(?:premium|free)/thumb/[^\s\)\]]+?\.png")

MIRROR_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "text/plain,text/html;q=0.9,*/*;q=0.8",
}

CDN_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Referer": "https://iconscout.com/",
    "Origin": "https://iconscout.com",
}


@dataclass
class Concept:
    out_name: str
    queries: list[str]
    include: list[str]
    exclude: list[str]


CONCEPTS: list[Concept] = [
    Concept("ram-module", ["ram-module", "computer-ram"], ["ram"], ["battering", "zodiac", "lamb"]),
    Concept("ssd-drive", ["ssd", "solid-state-drive"], ["ssd", "solid-state"], ["hard-disk"]),
    Concept("cpu-chip", ["cpu-chip", "processor-chip"], ["cpu", "processor", "chip"], ["case-cpu"]),
    Concept("gpu-card", ["gpu-card", "graphics-card"], ["gpu", "graphics-card", "graphic-card"], ["gift", "graph"]),
    Concept("motherboard", ["motherboard"], ["motherboard"], []),
    Concept("cooling-fan", ["cooling-fan", "computer-fan"], ["fan"], ["ceiling", "table-fan"]),
    Concept("usb-drive", ["usb-drive", "flash-drive", "usb-flash-drive"], ["usb", "flash-drive"], ["plug", "cable"]),
    Concept("hard-drive", ["hard-disk-drive", "hard-drive"], ["hard-disk", "hard-drive", "hdd"], ["ssd"]),
    Concept("floppy-disk", ["floppy-disk"], ["floppy"], []),
    Concept("cd", ["cd-disc", "compact-disc", "cd"], ["cd", "disc"], ["dvd-player"]),
    Concept("hdmi-cable", ["hdmi-cable", "hdmi"], ["hdmi", "cable"], ["adapter-only"]),
    Concept("circuit-board", ["circuit-board", "pcb-board"], ["circuit-board", "pcb", "motherboard"], ["board-game"]),
    Concept("binary-pattern", ["binary", "digital-panel"], ["binary", "code", "digital"], ["bitcoin"]),
    Concept("samsung-laptop-silhouette", ["samsung-laptop", "laptop"], ["samsung", "laptop"], ["tablet"]),
    Concept("monitor-silhouette", ["computer-monitor", "monitor"], ["monitor"], ["tv-remote"]),
    Concept("memory-chip", ["memory-chip", "chip-module"], ["memory-chip", "chip"], ["sd-card"]),
]


def fetch_text(url: str, headers: dict[str, str], timeout: int = 60) -> str:
    req = urllib.request.Request(url, headers=headers)
    context = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=timeout, context=context) as resp:
        return resp.read().decode("utf-8", "ignore")


def fetch_candidates(query: str) -> list[str]:
    mirror_url = f"https://r.jina.ai/http://iconscout.com/3d-icons/{query}"
    text = fetch_text(mirror_url, MIRROR_HEADERS)
    return sorted(set(PNG_RE.findall(text)))


def score_url(url: str, include: list[str], exclude: list[str]) -> int:
    lower = url.lower()
    score = 0
    for token in include:
        if token in lower:
            score += 4
    for token in exclude:
        if token in lower:
            score -= 6
    if "/premium/" in lower:
        score += 1
    return score


def pick_best(concept: Concept) -> tuple[str | None, list[tuple[int, str]]]:
    pool: set[str] = set()
    for q in concept.queries:
        try:
            urls = fetch_candidates(q)
            pool.update(urls)
        except Exception:
            continue

    scored = sorted(((score_url(u, concept.include, concept.exclude), u) for u in pool), reverse=True)
    if not scored:
        return None, []

    best_score, best_url = scored[0]
    if best_score <= 0:
        return None, scored[:10]
    return best_url, scored[:10]


def download_png(url: str, out_path: str) -> None:
    req = urllib.request.Request(url, headers=CDN_HEADERS)
    context = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=60, context=context) as resp:
        data = resp.read()
    with open(out_path, "wb") as f:
        f.write(data)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", default="src/assets/icons3d")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    manifest_lines = ["# Iconscout Pulled Icons", "", "Chosen sources:"]

    failed: list[str] = []
    for concept in CONCEPTS:
        best_url, preview = pick_best(concept)
        if not best_url:
            failed.append(concept.out_name)
            manifest_lines.append(f"- {concept.out_name}: NOT_FOUND")
            continue

        out_path = os.path.join(args.output_dir, f"{concept.out_name}.png")
        print(f"[pick] {concept.out_name} -> {best_url}")
        if not args.dry_run:
            try:
                download_png(best_url, out_path)
            except urllib.error.HTTPError as e:
                failed.append(concept.out_name)
                manifest_lines.append(f"- {concept.out_name}: HTTP_{e.code} {best_url}")
                continue
            except Exception:
                failed.append(concept.out_name)
                manifest_lines.append(f"- {concept.out_name}: DOWNLOAD_ERROR {best_url}")
                continue

        manifest_lines.append(f"- {concept.out_name}: {best_url}")

        if preview:
            for s, u in preview[:3]:
                print(f"  [alt {s:>2}] {u}")

    manifest_path = os.path.join(args.output_dir, "iconscout-manifest.md")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("\n".join(manifest_lines) + "\n")

    if failed:
        print("[warn] Missing/failed:", ", ".join(failed))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
