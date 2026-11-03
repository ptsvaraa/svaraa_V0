/**
 * The one-time claim code from the card in the box: three groups of four letters or digits, e.g. "SVRA-2041-7K3P".
 * The QR on the card holds a link with the code (https://svaraa.ai/c/<code> or svaraa://claim?code=<code>);
 * people may also type it with spaces, without dashes or in lower case.
 * PENDING SPEC: the code and QR format come from the hardware team; change only this file when they are final.
 */
export function parseClaimCode(raw: string): string | null {
  let text = raw.trim();
  const fromLink = /[?&]code=([^&#]+)/.exec(text)?.[1] ?? /\/c\/([^/?#]+)/.exec(text)?.[1];
  if (fromLink) text = decodeURIComponent(fromLink);
  const chars = text.toUpperCase().replace(/[\s-]/g, '');
  if (!/^[A-Z0-9]{12}$/.test(chars)) return null;
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`;
}
