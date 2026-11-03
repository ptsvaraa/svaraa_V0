import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useErrorText } from '@/features/auth/useErrorText';
import { useHousehold } from '@/features/household/store';
import { StepHeader } from '@/features/wearer/StepHeader';
import { useDrill } from '@/features/wearer/useDrill';
import { Button, Card, Screen, Text, useTheme } from '@/ui';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * C8 · Test your SOS. Hold the gold dot for three seconds, or tap the button. Contacts get an alert marked DRILL;
 * the drill passes when one of them answers within five minutes, then setup is finished and Home shows "Protected".
 * Also reachable from the wearer Home ("Run SOS drill"): once setup is done it is a practice run that ends with Done.
 */
export default function SosDrill() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const errorText = useErrorText();
  const setupDone = useHousehold((s) => s.hasActiveDevice);
  const { drill, start, starting, error, secondsLeft } = useDrill();
  const [finishing, setFinishing] = useState(false);
  const c = theme.colors;

  const finish = async () => {
    setFinishing(true);
    await useHousehold.getState().activate();
    router.replace('/home');
  };

  const waiting = drill?.status === 'waiting';
  const passed = drill?.status === 'passed';

  return (
    <Screen
      footer={
        setupDone ? (
          <Button label={t('common.done')} onPress={() => router.back()} disabled={waiting} fullWidth />
        ) : (
          <Button
            label={t('wearer.drill.finish')}
            onPress={() => void finish()}
            disabled={!passed}
            loading={finishing}
            fullWidth
          />
        )
      }
    >
      <StepHeader step={setupDone ? undefined : 5} title={t('wearer.drill.title')} />
      <View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{
          alignSelf: 'center',
          width: 112,
          height: 112,
          borderRadius: 56,
          borderWidth: 3,
          borderColor: c.accentSpirit,
          backgroundColor: c.attentionTint,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: theme.space[2],
        }}
      >
        <Text variant="label" tone="spirit">
          {t('wearer.drill.dot')}
        </Text>
      </View>
      <Text tone="secondary" style={{ textAlign: 'center' }}>
        {t('wearer.drill.how')}
      </Text>
      {!waiting && !passed ? (
        <Button
          label={drill?.status === 'expired' ? t('wearer.drill.again') : t('wearer.drill.run')}
          variant="secondary"
          onPress={() => void start()}
          loading={starting}
          fullWidth
        />
      ) : null}
      {waiting ? (
        <Card style={{ gap: theme.space[2] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space[3] }}>
            <ActivityIndicator color={c.action} />
            <Text variant="heading" accessibilityLiveRegion="polite">
              {t('wearer.drill.waiting', { time: clock(secondsLeft) })}
            </Text>
          </View>
          <Text tone="secondary">{t('wearer.drill.marked')}</Text>
        </Card>
      ) : null}
      {passed ? (
        <Card
          accessibilityLiveRegion="polite"
          style={{ gap: theme.space[2], borderLeftWidth: 4, borderLeftColor: c.good }}
        >
          <Text variant="heading" tone="heading">
            {t('wearer.drill.passed')}
          </Text>
          <Text tone="secondary">
            {drill?.acknowledged_by
              ? t('wearer.drill.answeredBy', { name: drill.acknowledged_by })
              : t('wearer.drill.answered')}
          </Text>
        </Card>
      ) : null}
      {drill?.status === 'expired' ? (
        <Card
          accessibilityRole="alert"
          style={{ gap: theme.space[2], borderLeftWidth: 4, borderLeftColor: c.attention }}
        >
          <Text variant="heading" tone="heading">
            {t('wearer.drill.expired')}
          </Text>
          <Text tone="secondary">{t('wearer.drill.expiredBody')}</Text>
        </Card>
      ) : null}
      {error ? (
        <Text tone="safety" accessibilityRole="alert">
          {errorText(error)}
        </Text>
      ) : null}
    </Screen>
  );
}
