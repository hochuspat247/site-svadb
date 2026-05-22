#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

APP_PATH = Path("src/app/App.tsx")

MOJIBAKE_MARKERS = re.compile(
    r"РЎ|Рџ|Рћ|Рљ|Рњ|РђР|Р'Р|РќР|Р—Р|РЎР‚|РЎРЅ|РЎС‚|вЂ|РќР|РћРў|РџРћ|РЎРљ|РЎРќ|РЎРџ|РЎР'|РЎРњ|РџСЂ|Р”Рѕ|Р’Р°|Р’С‹|Р—Р°|РќРµ|РђРќРљ|РќРђРЁ|Р“РћРЎ|РџРћР–|РњР•РЎ|Р РђРЎ|Р”Р Р•РЎ|РђРўРњ|Р’РћРџ|РћРўРџ|Р—РђР'|РџРћРЎ"
)

SKIP_LINE = re.compile(
    r"settings\.|coupleNames|siteImages|mergeSiteSections|resolveSiteImage|"
    r"getGallerySlides|welcomeSettings|heroSettings|locationSettings|"
    r"scheduleSettings|dressSettings|storySettings|gallerySettings|"
    r"giftsSettings|rsvpSettings|musicSettings|faqSettings|closingSettings|"
    r"sitePhotoOptions|defaultSiteSections|fetchSiteSections|photo-\d{2}|"
    r"import |from |\.\./|/api/|index\.html"
)


def fix_mojibake(text: str) -> str:
    raw_bytes: list[int] = []

    for char in text:
        code = ord(char)
        if code < 256:
            raw_bytes.append(code)
            continue

        try:
            encoded = char.encode("cp1251")
        except UnicodeEncodeError:
            continue

        if len(encoded) == 1:
            raw_bytes.append(encoded[0])

    return bytes(raw_bytes).decode("utf-8")


def should_fix(line: str) -> bool:
    return bool(MOJIBAKE_MARKERS.search(line)) and not SKIP_LINE.search(line)


def main() -> None:
    lines = APP_PATH.read_text(encoding="utf-8").splitlines()
    fixed_count = 0
    output: list[str] = []

    for line in lines:
        if should_fix(line):
            try:
                output.append(fix_mojibake(line))
                fixed_count += 1
                continue
            except UnicodeDecodeError:
                pass
        output.append(line)

    APP_PATH.write_text("\n".join(output) + "\n", encoding="utf-8")
    print(f"Fixed {fixed_count} lines in {APP_PATH}")


if __name__ == "__main__":
    main()
