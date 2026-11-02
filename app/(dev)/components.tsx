import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSettings, type SchemePreference } from '@/features/settings/store';
import {
  AttentionCard,
  Button,
  Card,
  Chip,
  Input,
  LanguageSwitch,
  OTPInput,
  Sheet,
  Steps,
  Text,
  useTheme,
  type ThemeMode,
} from '@/ui';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.space[3] }}>
      <Text variant="kicker" tone="spirit">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Choice<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space[2] }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            onPress={() => onChange(o.id)}
            style={{
              minHeight: theme.minTarget,
              paddingHorizontal: theme.space[4],
              justifyContent: 'center',
              borderRadius: theme.radius.full,
              borderWidth: 1.5,
              borderColor: on ? c.action : c.border,
              backgroundColor: on ? c.action : 'transparent',
            }}
          >
            <Text variant="label" style={{ color: on ? c.onAction : c.textPrimary }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Dev screen: every component, in both themes and both languages. */
export default function ComponentsDemo() {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { themeMode, scheme, setThemeMode, setScheme } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('98765');
  const [code, setCode] = useState('');
  const [current, setCurrent] = useState('household');
  const [sheet, setSheet] = useState(false);

  const steps = [
    { id: 'account', label: t('demo.steps.account'), done: true },
    { id: 'household', label: t('demo.steps.household'), done: false },
    { id: 'pendant', label: t('demo.steps.pendant'), done: false },
    { id: 'contacts', label: t('demo.steps.contacts'), done: false, locked: true },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.canvas }}
      contentContainerStyle={{
        padding: theme.space[4],
        paddingTop: theme.space[4] + insets.top,
        paddingBottom: theme.space[7] + insets.bottom,
        gap: theme.space[6],
        maxWidth: 640,
        width: '100%',
        alignSelf: 'center',
      }}
    >
      <View style={{ gap: theme.space[2] }}>
        <Text variant="kicker" tone="spirit">
          {t('demo.kicker')}
        </Text>
        <Text variant="title1" tone="heading" accessibilityRole="header">
          {t('demo.headline')}{' '}
          <Text variant="title1" tone="accent" italic>
            {t('demo.headlineAccent')}
          </Text>
        </Text>
        <Text tone="secondary">{t('demo.intro')}</Text>
      </View>

      <Section title={t('demo.section.settings')}>
        <LanguageSwitch />
        <Choice<ThemeMode>
          value={themeMode}
          onChange={setThemeMode}
          options={[
            { id: 'caretaker', label: t('demo.theme.caretaker') },
            { id: 'wearer', label: t('demo.theme.wearer') },
          ]}
        />
        <Choice<SchemePreference>
          value={scheme}
          onChange={setScheme}
          options={[
            { id: 'system', label: t('demo.theme.system') },
            { id: 'light', label: t('demo.theme.light') },
            { id: 'dark', label: t('demo.theme.dark') },
          ]}
        />
      </Section>

      <Section title={t('demo.section.buttons')}>
        <Button label={t('demo.button.primary')} />
        <Button label={t('demo.button.secondary')} variant="secondary" />
        <Button label={t('demo.button.tertiary')} variant="tertiary" />
        <Button label={t('demo.button.safety')} variant="safety" />
        <Button label={t('demo.button.disabled')} disabled />
        <Button label={t('demo.button.loading')} loading />
      </Section>

      <Section title={t('demo.section.inputs')}>
        <Input
          label={t('demo.input.name')}
          placeholder={t('demo.input.namePlaceholder')}
          hint={t('demo.input.nameHint')}
          value={name}
          onChangeText={setName}
        />
        <Input
          label={t('demo.input.phone')}
          error={t('demo.input.phoneError')}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </Section>

      <Section title={t('demo.section.otp')}>
        <OTPInput value={code} onChange={setCode} />
      </Section>

      <Section title={t('demo.section.cards')}>
        <Card>
          <Text variant="heading" tone="heading">
            {t('demo.card.title')}
          </Text>
          <Text tone="secondary">{t('demo.card.body')}</Text>
        </Card>
        <AttentionCard
          title={t('demo.card.title')}
          detail={t('demo.card.body')}
          action={t('demo.card.action')}
        />
        <AttentionCard severity="safety" title={t('demo.chip.safety')} action={t('demo.button.safety')} />
      </Section>

      <Section title={t('demo.section.chips')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space[2] }}>
          <Chip tone="good" label={t('demo.chip.connected')} />
          <Chip tone="attention" label={t('demo.chip.attention')} />
          <Chip tone="safety" label={t('demo.chip.safety')} />
          <Chip tone="neutral" label={t('demo.chip.neutral')} />
          <Chip tone="plain" label={t('demo.chip.private')} />
        </View>
      </Section>

      <Section title={t('demo.section.steps')}>
        <Steps steps={steps} currentId={current} onSelect={setCurrent} />
      </Section>

      <Section title={t('demo.section.sheet')}>
        <Button label={t('demo.sheet.open')} variant="secondary" onPress={() => setSheet(true)} />
        <Sheet
          open={sheet}
          title={t('demo.sheet.title')}
          onClose={() => setSheet(false)}
          actions={<Button label={t('common.done')} fullWidth onPress={() => setSheet(false)} />}
        >
          <Text tone="secondary">{t('demo.sheet.body')}</Text>
        </Sheet>
      </Section>
    </ScrollView>
  );
}
