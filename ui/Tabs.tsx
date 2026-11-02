import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

export type TabItem<T extends string = string> = { id: T; label: string };

/** Switch between a few views on one screen, such as Today / People / Settings. One tab is always selected. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: c.border }}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.id)}
            style={{
              flex: 1,
              minHeight: theme.minTarget,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: theme.space[2],
              borderBottomWidth: 3,
              borderBottomColor: selected ? c.action : 'transparent',
              marginBottom: -1,
            }}
          >
            <Text variant="label" tone={selected ? 'heading' : 'secondary'}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
