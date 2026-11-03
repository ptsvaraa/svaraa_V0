import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/services/auth/authApi';
import { useSession } from '@/services/auth/session';

/**
 * The name for "Hello, {name}": the backend display name if there is one, otherwise the name Google gave us
 * at sign-in. Returns undefined when neither exists (the greeting is then just "Hello").
 */
export function useGreetingName(): string | undefined {
  const googleName = useSession((s) => s.googleName);
  const userId = useSession((s) => s.userId);
  const profile = useQuery({
    queryKey: ['profile', userId],
    queryFn: getProfile,
    enabled: !!userId,
    retry: false,
  });
  const name = profile.data?.display_name?.trim() || googleName?.trim();
  return name ? name.split(/\s+/)[0] : undefined; // first name only
}
