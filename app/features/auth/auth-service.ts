import type { LoginValues } from './login-schema';
import type { DemoAuthUser } from './auth-types';
export type { AuthUser } from './auth-types';

export async function authenticate(
  values: LoginValues,
): Promise<DemoAuthUser | null> {
  if (values.username === 'admin' && values.password === 'admin123456Aa@') {
    return { kind: 'demo', username: 'admin' };
  }
  return null;
}
