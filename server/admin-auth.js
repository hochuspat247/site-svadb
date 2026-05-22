import crypto from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "1234561";
}

function getTokenSecret() {
  return process.env.ADMIN_TOKEN_SECRET || `${getAdminPassword()}::wedding-admin`;
}

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", getTokenSecret())
    .update(payload)
    .digest("base64url");
}

export function isValidAdminPassword(password) {
  return password === getAdminPassword();
}

export function issueAdminToken() {
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + TOKEN_TTL_MS,
  });

  return `${toBase64Url(payload)}.${signPayload(payload)}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  const payload = fromBase64Url(encodedPayload);
  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return false;
  }

  if (
    !crypto.timingSafeEqual(
      signatureBuffer,
      expectedSignatureBuffer,
    )
  ) {
    return false;
  }

  try {
    const parsed = JSON.parse(payload);
    return parsed.role === "admin" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}
