import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** Pick any number of options, shown as pills (for example preferred languages). */
export function MultiChoice<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T[];
  options: { id: T; label: string }[];
  onChange: (ids: T[]) => void;
  /** Already-translated name of the group, for screen readers. */
  label?: string;
}) {
  const theme = useTheme();
  const c = theme.colors;
  const toggle = (id: T) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  return (
    <View accessibilityLabel={label} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space[2] }}>
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <Pressable
            key={o.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={o.label}
            onPress={() => toggle(o.id)}
            style={{
              minHeight: theme.minTarget,
              paddingHorizontal: theme.space[4],
              justifyContent: 'center',
              borderRadius: theme.radius.full,
              borderWidth: 1.5,
              borderColor: on ? c.action : c.border,
              backgroundColor: on ? c.sunken : 'transparent',
            }}
          >
            <Text variant="label" style={{ color: on ? c.action : c.textPrimary }}>
              {on ? `✓ ${o.label}` : o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
