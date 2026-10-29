import { env } from '@/lib/env';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

/** /api/v1 기준 요청. 인증은 Authorization: Bearer {accessToken} */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return (res.status === 204 ? undefined : await res.json()) as T;
}
