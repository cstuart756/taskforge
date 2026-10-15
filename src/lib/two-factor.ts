import crypto from "crypto";
import {
  generateSecret as otplibGenerateSecret,
  verify as otplibVerify,
  generateURI as otplibGenerateURI,
} from "otplib";
import QRCode from "qrcode";

const BACKUP_CODE_COUNT = 10;
const APP_NAME = "TaskForge";

// TOTP configuration — 6-digit codes, 30-second window.
// Passed to each otplib call in v13+ (no global options object).
const TOTP_OPTIONS = {
  digits: 6,
  step: 30,
  window: 1, // accept ±1 window (±30s) for clock drift
};

/**
 * Generate a new random base32 secret for TOTP.
 * This is what gets shared with the authenticator app.
 */
export function generateSecret(): string {
  return otplibGenerateSecret();
}

/**
 * Build the otpauth:// URI that authenticator apps understand.
 * The URI is what actually gets encoded into the QR code.
 */
export function generateOtpauthUrl(email: string, secret: string): string {
  return otplibGenerateURI({
    issuer: APP_NAME,
    label: email,
    secret,
  });
}

/**
 * Render the otpauth URI as a PNG data URL for display.
 */
export async function generateQRCodeDataUrl(
  otpauthUrl: string
): Promise<string> {
  return QRCode.toDataURL(otpauthUrl, {
    width: 256,
    margin: 2,
    color: { dark: "#111827", light: "#ffffff" },
  });
}

/**
 * Verify a 6-digit TOTP code against the secret.
 * Accepts spaces (some users paste "123 456").
 *
 * NOTE: in otplib v13+ this is async.
 */
export async function verifyTOTP(
  token: string,
  secret: string
): Promise<boolean> {
  const clean = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(clean)) return false;

  try {
    const result = await otplibVerify({
      token: clean,
      secret,
      ...TOTP_OPTIONS,
    });

    // otplib has returned both boolean and { valid: boolean } across versions
    if (typeof result === "boolean") return result;
    return Boolean((result as { valid?: boolean })?.valid);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Backup codes
// ---------------------------------------------------------------------------

// Unambiguous alphabet — no 0/O, 1/I/L which are often confused
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateOneBackupCode(): string {
  const bytes = crypto.randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  // Format as XXXX-XXXX for readability
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/**
 * Hash a backup code so we never store it in plaintext.
 * Strips dashes and normalises case so "abcd-efgh" and "ABCDEFGH" hash the same.
 */
export function hashBackupCode(code: string): string {
  const normalised = code.replace(/[-\s]/g, "").toUpperCase();
  return crypto.createHash("sha256").update(normalised).digest("hex");
}

/**
 * Generate a fresh set of backup codes.
 * Returns the plaintext codes (show to user once) and their hashes (store in DB).
 */
export function generateBackupCodes(): {
  plain: string[];
  hashed: string[];
} {
  const plain: string[] = [];
  const hashed: string[] = [];

  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    const code = generateOneBackupCode();
    plain.push(code);
    hashed.push(hashBackupCode(code));
  }

  return { plain, hashed };
}

/**
 * Check if a user-supplied code matches any stored hash.
 * Returns the matching hash if found, otherwise null.
 */
export function findMatchingBackupCode(
  candidate: string,
  hashedCodes: string[]
): string | null {
  const candidateHash = hashBackupCode(candidate);
  return hashedCodes.includes(candidateHash) ? candidateHash : null;
}