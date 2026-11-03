import { api, call } from '@/services/api';
import { flags } from '@/config/flags';
import { useSession } from './session';

/** A phone number is two fields on the backend: the dialling code and the number without it. */
export type PhoneNumber = { countryCode: string; mobile: string };
const body = (p: PhoneNumber) => ({ country_code: p.countryCode, mobile_number: p.mobile });
export const formatPhone = (p: PhoneNumber) => `${p.countryCode} ${p.mobile}`;

export const requestOtp = (p: PhoneNumber) => call(api.POST('/api/v1/auth/otp/request', { body: body(p) }));

/** Verify the code and sign in. Saves the session. Returns whether the account is new. */
export async function verifyOtpAndSignIn(p: PhoneNumber, code: string): Promise<{ isNew: boolean }> {
  const out = await call(api.POST('/api/v1/auth/otp/verify', { body: { ...body(p), code } }));
  await useSession.getState().signIn(out, { method: 'phone', mobile: p.countryCode + p.mobile });
  return { isNew: out.is_new };
}

export async function signInWithGoogleToken(idToken: string, name?: string): Promise<{ isNew: boolean }> {
  const out = await call(api.POST('/api/v1/auth/google', { body: { id_token: idToken } }));
  await useSession.getState().signIn(out, { method: 'google', googleName: name });
  return { isNew: out.is_new };
}

/** Add a mobile number to a Google account: send the code, then confirm it. */
export const requestMobile = (p: PhoneNumber) =>
  call(api.POST('/api/v1/auth/mobile/request', { body: body(p) }));

export async function verifyMobile(p: PhoneNumber, code: string): Promise<void> {
  await call(api.POST('/api/v1/auth/mobile/verify', { body: { ...body(p), code } }));
  await useSession.getState().setMobile(p.countryCode + p.mobile);
}

/** End this session on the server, then on this phone. The phone is signed out even if the server cannot be reached. */
export async function logout(): Promise<void> {
  try {
    await call(api.POST('/api/v1/auth/logout'));
  } catch {
    /* signing out must always work */
  }
  await useSession.getState().clear();
}

export const getProfile = () => call(api.GET('/api/v1/users/me'));
export const updateProfile = (patch: { display_name?: string; avatar_url?: string }) =>
  call(api.PATCH('/api/v1/users/me', { body: patch }));
export const skipProfile = () => call(api.POST('/api/v1/users/me/profile/skip'));

export type GoogleResult = { idToken: string; name?: string };

/**
 * Google sign-in. MOCK for now: returns a fake ID token and name.
 * Real sign-in needs a development build (not Expo Go) and the Google OAuth client IDs (web, iOS, Android):
 * use @react-native-google-signin/google-signin in services/auth/google.native.ts, with a .web stub.
 */
export async function getGoogleCredential(): Promise<GoogleResult> {
  if (flags.googleSignIn === 'mock') return { idToken: 'mock-google-id-token', name: 'Samarth' };
  throw new Error('Native Google sign-in is not wired yet');
}
