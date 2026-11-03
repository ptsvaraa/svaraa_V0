import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Sheet } from './Sheet';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** A field that opens a sheet to pick one option. Looks like an Input. */
export function Select<T extends string>({
  label,
  title,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  /** Title of the sheet. */
  title: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const c = theme.colors;
  const current = options.find((o) => o.id === value);
  return (
    <View style={{ gap: theme.space[1] }}>
      <Text variant="label" tone="secondary">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current?.label ?? ''}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          minHeight: Math.max(theme.minTarget, 48),
          paddingHorizontal: theme.space[3],
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: disabled ? c.sunken : c.surfaceSolid,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Text>{current?.label}</Text>
        <Text tone="tertiary" accessibilityElementsHidden importantForAccessibility="no">
          {'⌄'}
        </Text>
      </Pressable>
      <Sheet open={open} title={title} onClose={() => setOpen(false)}>
        <View accessibilityRole="radiogroup" style={{ gap: theme.space[1] }}>
          {options.map((o) => {
            const on = o.id === value;
            return (
              <Pressable
                key={o.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={o.label}
                onPress={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
                style={{
                  minHeight: theme.minTarget,
                  paddingHorizontal: theme.space[3],
                  borderRadius: theme.radius.md,
                  justifyContent: 'center',
                  backgroundColor: on ? c.sunken : 'transparent',
                }}
              >
                <Text variant={on ? 'heading' : 'body'}>{o.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text variant="bodySm" tone="tertiary" accessibilityElementsHidden importantForAccessibility="no">
          {t('common.close')}
        </Text>
      </Sheet>
    </View>
  );
}
