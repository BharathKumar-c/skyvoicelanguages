export type FormResult = { message?: string; mode?: "live" | "preview" };

const NETWORK_ERROR =
  "We could not reach the server. Check your connection and try again.";

/**
 * POSTs a form payload as JSON and returns the parsed reply. Throws an Error
 * whose message is safe to show the visitor: the server's own message when it
 * sent one, or `fallback` when the reply is not JSON (a proxy error page, a
 * timeout) — never a raw "Failed to fetch" or JSON parse error.
 */
export async function postForm(url: string, body: unknown, fallback: string, networkError = NETWORK_ERROR) {
  let response: Response;
  try {
    response = await fetch(url, {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch {
    throw new Error(networkError);
  }

  let result: FormResult = {};
  try {
    result = (await response.json()) as FormResult;
  } catch {
    // Non-JSON reply; fall through to the status check.
  }

  if (!response.ok) throw new Error(result.message ?? fallback);
  return result;
}
