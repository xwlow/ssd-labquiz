import { validateInput } from './validateInput';

describe('validateInput', () => {
  it('detects XSS input', () => {
    expect(validateInput("<script>alert('xss')</script>")).toBe(true);
    expect(validateInput("<img src=x onerror=alert('xss')>")).toBe(true);
  });

  it('detects SQL injection input', () => {
    expect(validateInput("' OR 1=1 --")).toBe(true);
    expect(validateInput("admin' --")).toBe(true);
    expect(validateInput("1; SELECT * FROM users")).toBe(true);
  });

  it('allows safe input', () => {
    expect(validateInput("hello world")).toBe(false);
    expect(validateInput("search term")).toBe(false);
  });
});
