import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useErrorText } from '@/features/auth/useErrorText';
import { useHousehold } from '@/features/household/store';
import { parseClaimCode } from '@/features/wearer/claimCode';
import { QrScanner } from '@/features/wearer/QrScanner';
import { StepHeader } from '@/features/wearer/StepHeader';
import { WEARER_STEP } from '@/features/wearer/steps';
import { useWearer } from '@/features/wearer/store';
import { toApiError } from '@/services/api';
import { claimPendant } from '@/services/household/wearerApi';
import { Button, Card, Input, Screen, Text, useTheme } from '@/ui';

/**
 * C2 · Claim your pendant. Scan the QR on the card inside the box, or type its code. The one-time code makes this
 * household the owner (claim stays "unverified" until pairing). A pendant owned by someone else shows who, masked
 * to one initial. The box QR can also open the app here directly: svaraa://wearer/claim?code=...
 */
export default function ClaimPendant() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const errorText = useErrorText();
  const householdId = useHousehold((s) => s.householdId);
  const params = useLocalSearchParams<{ code?: string }>();
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ownerHint, setOwnerHint] = useState<string | null>(null);
  const fromLink = useRef(false);

  const claim = async (raw: string) => {
    if (!householdId || busy) return;
    setError(null);
    setOwnerHint(null);
    const code = parseClaimCode(raw);
    if (!code) {
      setError(t('errors.invalid_claim_code'));
      return;
    }
    setBusy(true);
    try {
      const device = await claimPendant(householdId, code);
      await useWearer.getState().save({ device });
      await useHousehold.getState().reachStep(WEARER_STEP.claim);
      router.replace('/wearer/pair');
    } catch (e) {
      const err = toApiError(e);
      if (err.code === 'device_already_claimed') {
        const hint = err.details?.owner_hint;
        setOwnerHint(typeof hint === 'string' && hint ? hint.slice(0, 1) : '');
      } else setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  // Opened from the box QR: claim straight away.
  useEffect(() => {
    if (params.code && householdId && !fromLink.current) {
      fromLink.current = true;
      void claim(params.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.code, householdId]);

  return (
    <Screen
      footer={
        typing ? (
          <>
            <Button
              label={t('wearer.claim.submit')}
              onPress={() => void claim(typed)}
              disabled={!typed.trim()}
              loading={busy}
              fullWidth
            />
            <Button
              label={t('wearer.claim.scanInstead')}
              variant="tertiary"
              onPress={() => setTyping(false)}
            />
          </>
        ) : (
          <Button label={t('wearer.claim.typeInstead')} variant="tertiary" onPress={() => setTyping(true)} />
        )
      }
    >
      <StepHeader step={2} title={t('wearer.claim.title')} />
      {typing ? (
        <Input
          label={t('wearer.claim.codeLabel')}
          hint={t('wearer.claim.codeHint')}
          value={typed}
          onChangeText={setTyped}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder={t('wearer.claim.codePlaceholder')}
          onSubmitEditing={() => void claim(typed)}
        />
      ) : (
        <>
          <QrScanner onScan={(data) => void claim(data)} paused={busy || ownerHint !== null} />
          <Text tone="secondary">{t('wearer.claim.where')}</Text>
        </>
      )}
      <Card style={{ gap: theme.space[2] }}>
        <Text tone="secondary">{t('wearer.claim.owner')}</Text>
      </Card>
      {ownerHint !== null ? (
        // E5 (FE-A) will become its own screen; until then the blocked claim is shown here.
        <Card
          accessibilityRole="alert"
          style={{ gap: theme.space[2], borderLeftWidth: 4, borderLeftColor: theme.colors.safety }}
        >
          <Text variant="heading" tone="heading">
            {t('wearer.claim.taken.title')}
          </Text>
          <Text tone="secondary">
            {ownerHint
              ? t('wearer.claim.taken.owner', { initial: ownerHint })
              : t('wearer.claim.taken.ownerUnknown')}
          </Text>
          <Text tone="secondary">{t('wearer.claim.taken.next')}</Text>
          <Button
            label={t('wearer.claim.taken.retry')}
            variant="secondary"
            onPress={() => setOwnerHint(null)}
          />
        </Card>
      ) : null}
      {error ? (
        <Text tone="safety" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}
