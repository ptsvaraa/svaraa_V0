import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePendantStatus, useReconnect } from '@/features/pendant/store';
import { useWearer } from '@/features/wearer/store';
import { Button, Card, Chip, Screen, Text, useTheme } from '@/ui';
import { useGreetingName } from './useGreetingName';

/**
 * E2 · Wearer Home, once the pendant is Active (the setup card is gone). Shows whether the wearer is protected,
 * the pendant's battery and connection, when Svaraa listens, their emergency contacts, and a practice SOS drill.
 * Reconnects to the paired pendant when the app opens.
 */
export function WearerHome() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useWearer((s) => s.profile);
  const contacts = useWearer((s) => s.contacts);
  const pendantId = useWearer((s) => s.pendantId);
  const greetingName = useGreetingName();
  const { connection, battery, charging } = usePendantStatus();
  useReconnect(pendantId);

  const name = profile?.call_as || profile?.name.split(/\s+/)[0] || greetingName;
  const connected = connection === 'connected';
  const c = theme.colors;
  const pendantLine = connected
    ? battery !== undefined
      ? t(charging ? 'wearerHome.pendantCharging' : 'wearerHome.pendant', { battery })
      : t('pendant.connected')
    : connection === 'connecting'
      ? t('wearerHome.connecting')
      : t('pendant.notConnected');

  return (
    <Screen bottomInset={false}>
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {name ? t('home.greeting', { name }) : t('home.greetingNoName')}
      </Text>

      <Card
        style={{ gap: theme.space[2], borderLeftWidth: 4, borderLeftColor: connected ? c.good : c.attention }}
      >
        <Chip
          label={connected ? t('wearerHome.protected') : t('wearerHome.notProtected')}
          tone={connected ? 'good' : 'attention'}
        />
        <Text variant="heading" accessibilityLiveRegion="polite">
          {pendantLine}
        </Text>
        {!connected ? <Text tone="secondary">{t('wearerHome.keepClose')}</Text> : null}
      </Card>

      <Card style={{ gap: theme.space[2] }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.space[3],
          }}
        >
          <Text variant="heading" style={{ flexShrink: 1 }}>
            {t('wearerHome.listening')}
          </Text>
          {/* PENDING FE-14: becomes "On" with the pendant's recording state once the voice relay exists. */}
          <Chip label={t('wearerHome.listeningOff')} tone="neutral" />
        </View>
        <Text tone="secondary">{t('wearerHome.listeningDetail')}</Text>
      </Card>

      <Card style={{ gap: theme.space[2] }}>
        <Text variant="heading">{t('wearerHome.people')}</Text>
        <Text tone="secondary">
          {contacts.length ? contacts.map((p) => p.name).join(', ') : t('wearerHome.noPeople')}
        </Text>
      </Card>

      <Button
        label={t('wearer.drill.run')}
        variant="secondary"
        onPress={() => router.push('/wearer/drill')}
        fullWidth
      />
    </Screen>
  );
}
