import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// We use a function to get the secret to ensure it's read from the latest process.env in each runtime context
function getSecretKey() {
  const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-me';
  if (!process.env.JWT_SECRET) {
    console.warn('[AUTH_DEBUG][lib] JWT_SECRET is missing in this runtime! Using fallback.');
  }
  return new TextEncoder().encode(secret);
}

const signingKey = getSecretKey();
// For verification, we try the env secret first, then the fallback
const verificationKeys = [signingKey];

export async function encrypt(
  payload: JWTPayload,
  expiry: string | number | Date
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(signingKey);
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
  for (const key of verificationKeys) {
    try {
      const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
      });
      return payload;
    } catch (err: any) {
      // try next key or log if last key
      if (key === verificationKeys[verificationKeys.length - 1]) {
        console.error('[AUTH_DEBUG][decrypt] Verification failed:', err.message);
      }
    }
  }

  return null;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    return await decrypt(token);
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    console.log('[AUTH_DEBUG][lib] No token found in cookies');
    return null;
  }

  console.log('[AUTH_DEBUG][lib] Token found, length:', token.length);
  const session = await decrypt(token);
  if (!session) {
    console.log('[AUTH_DEBUG][lib] Decryption failed - session is null');
  } else {
    console.log('[AUTH_DEBUG][lib] Decryption successful for:', session.sub);
  }
  return session;
}
