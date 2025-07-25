export function validateInput(input: string): boolean {
  const xssPattern = /<script.*?>.*?<\/script>|onerror\s*=/i;
  const sqlPattern = /('|--|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b)/i;
  return xssPattern.test(input) || sqlPattern.test(input);
}
