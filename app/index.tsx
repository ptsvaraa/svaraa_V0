import { Redirect } from 'expo-router';
import { useSession } from '@/services/auth/session';

/** Picks the first screen from the sign-in state. Screens send people here after sign-in, so there is one place for the rules. */
export default function Index() {
  const { status, method, mobile, showIntro } = useSession();
  if (status !== 'signedIn') return <Redirect href="/welcome" />;
  if (method === 'google' && !mobile) return <Redirect href="/add-phone" />;
  if (showIntro) return <Redirect href="/intro" />;
  return <Redirect href="/home" />;
}
