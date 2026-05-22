#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGETS = [
    ROOT / "src/app/App.tsx",
    ROOT / "src/app/admin/AdminPage.tsx",
    ROOT / "src/app/api/wedding-api.ts",
]

SKIP_LINE = re.compile(
    r"^\s*import |^\s*export |from ['\"]|resolveSiteImage|getSection\(|sectionMap|"
    r"photo-\d{2}|\.png|\.jpg|/api/|index\.html|className=|style=\{\{"
)

# UTF-8 read as cp1251: lines often contain Р/С followed by more Cyrillic letters
MOJIBAKE_HINT = re.compile(
    r"Р[ЂЃЄЅІЇЈЉЊЋЌЎЏА-Яа-яђѓєѕіїЈЉЊЋЌЎЏ]|"
    r"С[ЂЃЄЅІЇЈЉЊЋЌЎЏА-Яа-яђѓєѕіїЈЉЊЋЌЎЏ]|"
    r"вЂ|РµР|РїР|РЅР|РѕР|РІР|РґР|СЃР|С‚Р|СЏР|СЌС"
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
    if SKIP_LINE.search(line):
        return False
    return bool(MOJIBAKE_HINT.search(line))


def process_file(path: Path) -> int:
    lines = path.read_text(encoding="utf-8").splitlines()
    fixed_count = 0
    output: list[str] = []

    for line in lines:
        if should_fix(line):
            try:
                fixed = fix_mojibake(line)
                if fixed != line:
                    output.append(fixed)
                    fixed_count += 1
                    continue
            except UnicodeDecodeError:
                pass
        output.append(line)

    path.write_text("\n".join(output) + "\n", encoding="utf-8")
    return fixed_count


def main() -> None:
    total = 0
    for target in TARGETS:
        count = process_file(target)
        total += count
        print(f"Fixed {count} lines in {target.relative_to(ROOT)}")
    print(f"Total: {total}")


if __name__ == "__main__":
    main()
