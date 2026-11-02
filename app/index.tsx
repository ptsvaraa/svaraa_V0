import { Redirect } from 'expo-router';

/** Temporary: the first screen is the component demo until sign-in (FE-02) lands. */
export default function Index() {
  return <Redirect href="/components" />;
}
