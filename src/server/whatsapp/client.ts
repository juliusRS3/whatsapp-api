import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { Client, LocalAuth } from "whatsapp-web.js";

function ensureWritableDirectory(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
  fs.accessSync(dirPath, fs.constants.W_OK);
}

export function resolveDataPath() {
  const configuredPath = process.env.WWEBJS_DATA_DIR;
  const candidates = [
    configuredPath,
    path.resolve(process.cwd(), ".data/wwebjs"),
    path.resolve(os.homedir(), ".wwebjs"),
  ].filter((value): value is string => Boolean(value));

  const failures: string[] = [];

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);

    try {
      ensureWritableDirectory(resolved);
      return resolved;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${resolved}: ${message}`);
    }
  }

  throw new Error(
    `Unable to create a writable WhatsApp auth directory. Set WWEBJS_DATA_DIR to a writable path. Tried: ${failures.join(" | ")}`,
  );
}

/**
 * Phone number to link by typed pairing code instead of a QR code, digits with country code
 * (e.g. 60123456789). Set PAIRING_PHONE_NUMBER on the server. The 8-character code then appears
 * on the admin page; on the phone: Linked devices > Link a device > Link with phone number instead.
 */
export function pairingPhoneNumber() {
  const digits = (process.env.PAIRING_PHONE_NUMBER || "").replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function createWwebjsClient(sessionId: string) {
  const resolvedDir = resolveDataPath();
  const pairingPhone = pairingPhoneNumber();

  return new Client({
    ...(pairingPhone
      ? { pairWithPhoneNumber: { phoneNumber: pairingPhone, showNotification: true, intervalMs: 180000 } }
      : {}),
    authStrategy: new LocalAuth({
      clientId: sessionId,
      dataPath: resolvedDir,
    }),
    puppeteer: {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    },
  });
}
