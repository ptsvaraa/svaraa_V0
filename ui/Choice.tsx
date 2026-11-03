import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** Pick one of a few options, shown as pills. */
export function Choice<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
  /** Already-translated name of the group, for screen readers. */
  label?: string;
}) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space[2] }}
    >
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
