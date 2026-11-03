import { toApiError } from './errors';

type Result<T> = { data?: T; error?: unknown; response: Response };

/** Await an API call and return its data. Anything that goes wrong is thrown as an ApiError (see errors.ts). */
export async function call<T>(request: Promise<Result<T>>): Promise<T> {
  let result: Result<T>;
  try {
    result = await request;
  } catch (e) {
    throw toApiError(e);
  }
  if (result.error !== undefined || !result.response.ok)
    throw toApiError(result.error, result.response.status);
  return result.data as T;
}
