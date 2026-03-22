export interface CheckInput {
  url: string;
  method: string;
  expectedStatus: number;
  timeoutMs: number;
  degradedThresholdMs?: number;
}

export interface CheckResult {
  status: "up" | "down" | "degraded";
  responseTimeMs: number;
  statusCode: number | null;
  errorMessage: string | null;
}

export async function performCheck(input: CheckInput): Promise<CheckResult> {
  const { url, method, expectedStatus, timeoutMs, degradedThresholdMs = 2000 } = input;
  const start = performance.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);
    const responseTimeMs = Math.round(performance.now() - start);

    if (response.status !== expectedStatus) {
      return {
        status: "down",
        responseTimeMs,
        statusCode: response.status,
        errorMessage: `Expected ${expectedStatus}, got ${response.status}`,
      };
    }

    const status = responseTimeMs > degradedThresholdMs ? "degraded" : "up";

    return {
      status,
      responseTimeMs,
      statusCode: response.status,
      errorMessage: null,
    };
  } catch (error) {
    const responseTimeMs = Math.round(performance.now() - start);
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      status: "down",
      responseTimeMs,
      statusCode: null,
      errorMessage: message,
    };
  }
}
