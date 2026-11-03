import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** One big choice (a radio card): a title, a line under it, and a ring that fills when picked. */
export function Option({
  title,
  detail,
  selected,
  onPress,
}: {
  /** Already-translated text. */
  title: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      onPress={onPress}
      style={{
        minHeight: theme.minTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space[4],
        padding: theme.space[4],
        borderRadius: theme.radius.xl,
        borderWidth: 1.5,
        borderColor: selected ? c.action : c.border,
        backgroundColor: selected ? c.sunken : c.surfaceSolid,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selected ? c.action : c.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c.action }} />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="heading">{title}</Text>
        {detail ? <Text tone="secondary">{detail}</Text> : null}
      </View>
    </Pressable>
  );
}
