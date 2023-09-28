import { Context } from 'vm';

/**
 * Sets the response properties of a given context object.
 * @param context - The context object to modify.
 * @param status - The status code to set in the response.
 * @param body - The body content to set in the response.
 */
export function handleResponse(context: Context, status: number, body: string | object): void {
  context.res = {
    status: status || 200,
    body: body
  };
}
