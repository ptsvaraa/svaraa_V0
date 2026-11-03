import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** A tick box with its label. The whole row is the tap target. `children` can add a link after the label. */
export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  children,
}: {
  /** Already-translated text. */
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space[2], flexWrap: 'wrap' }}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled: !!disabled }}
        accessibilityLabel={label}
        disabled={disabled}
        onPress={() => onChange(!checked)}
        style={{
          minHeight: theme.minTarget,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space[3],
          flexShrink: 1,
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: theme.radius.sm - 2,
            borderWidth: 2,
            borderColor: checked ? c.action : c.border,
            backgroundColor: checked ? c.action : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {checked ? (
            <Text variant="label" style={{ color: c.onAction }}>
              {'✓'}
            </Text>
          ) : null}
        </View>
        <Text style={{ flexShrink: 1 }}>{label}</Text>
      </Pressable>
      {children}
    </View>
  );
}
