import type { Option } from "../util/option";
export const serverMode = import.meta.env.VITE_DATA_SOURCE === "server";
export async function request<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "서버에 연결하지 못했어요. 인터넷 연결과 서버 실행 상태를 확인해 주세요.",
    );
  }
  let result: Option<T>;
  try {
    result = await response.json();
  } catch {
    throw new Error("서버 응답을 읽지 못했어요. 다시 시도해 주세요.");
  }
  if (!response.ok || !result || !result.ok)
    throw new Error(
      (result && !result.ok && result.error) || "요청을 처리하지 못했어요.",
    );
  return result.data;
}
