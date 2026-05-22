const MOJIBAKE_PATTERN =
  /Р[ЂЃЄЅІЇЈЉЊЋЌЎЏА-Яа-яђѓєѕіїЈЉЊЋЌЎЏ]|С[ЂЃЄЅІЇЈЉЊЋЌЎЏА-Яа-яђѓєѕіїЈЉЊЋЌЎЏ]|вЂ|РµР|РїР|РЅР|РѕР|РІР|РґР|СЃР|С‚Р|СЏР|СЌС|Р'Р|Р«/;

const KNOWN_FIXES: Record<string, string> = {
  "Р'Р«": "Вы",
  "Р\u2019Р«": "Вы",
};

function toSingleByteArray(text: string): number[] {
  const bytes: number[] = [];

  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code < 256) {
      bytes.push(code);
      continue;
    }

    try {
      const encoded = new TextEncoder().encode(char);
      if (encoded.length === 1) {
        bytes.push(encoded[0]);
      }
    } catch {
      // ignore
    }
  }

  return bytes;
}

export function fixMojibakeText(text?: string | null): string {
  if (!text) {
    return "";
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return text;
  }

  if (KNOWN_FIXES[trimmed]) {
    return KNOWN_FIXES[trimmed];
  }

  if (!MOJIBAKE_PATTERN.test(trimmed)) {
    return text;
  }

  try {
    const bytes = toSingleByteArray(trimmed);
    if (!bytes.length) {
      return text;
    }

    const decoded = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
    if (decoded && !decoded.includes("\uFFFD") && decoded !== trimmed) {
      return decoded;
    }
  } catch {
    // keep original
  }

  return text;
}
