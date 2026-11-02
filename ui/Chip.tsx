import { View } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

export type ChipTone = 'neutral' | 'good' | 'attention' | 'safety' | 'plain';

/** Status label. Always has a word, never colour alone. A dot marks the state. */
export function Chip({ label, tone = 'neutral' }: { label: string; tone?: ChipTone }) {
  const theme = useTheme();
  const c = theme.colors;
  const p = {
    neutral: { bg: c.sunken, fg: c.textSecondary, dot: c.textTertiary },
    plain: { bg: 'transparent', fg: c.textSecondary, dot: c.textTertiary },
    good: { bg: c.goodTint, fg: c.good, dot: c.good },
    attention: { bg: c.attentionTint, fg: c.attention, dot: c.attention },
    safety: { bg: c.safetyTint, fg: c.safety, dot: c.safety },
  }[tone];
  return (
    <View
      accessible
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: theme.space[2],
        paddingHorizontal: theme.space[3],
        paddingVertical: theme.space[1],
        borderRadius: theme.radius.full,
        backgroundColor: p.bg,
        borderWidth: tone === 'plain' ? 1 : 0,
        borderColor: c.border,
      }}
    >
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: p.dot }} />
      <Text variant="label" style={{ color: p.fg }}>
        {label}
      </Text>
    </View>
  );
}
