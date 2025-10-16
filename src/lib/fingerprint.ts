import type { Agent } from "@fingerprintjs/fingerprintjs";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

let fpPromise: Promise<Agent> | null = null;

/**
 * Initialize and get FingerprintJS agent
 * Uses singleton pattern to avoid multiple initializations
 */
async function getFpAgent(): Promise<Agent> {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
}

/**
 * Generate a browser fingerprint for the current visitor
 * @returns A unique fingerprint string
 */
export async function getFingerprint(): Promise<string> {
  try {
    const fp = await getFpAgent();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error("Failed to generate fingerprint:", error);
    // Fallback to a simple fingerprint if FingerprintJS fails
    return generateSimpleFingerprint();
  }
}

/**
 * Fallback fingerprint generation using basic browser properties
 * Used when FingerprintJS fails
 */
function generateSimpleFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth.toString(),
    `${screen.width}x${screen.height}`,
    new Date().getTimezoneOffset().toString(),
    navigator.hardwareConcurrency?.toString() || "0",
    // Using userAgentData as platform is deprecated
    (navigator as any).userAgentData?.platform ||
      navigator.platform ||
      "unknown",
  ];

  return btoa(components.join("|")).substring(0, 32);
}
