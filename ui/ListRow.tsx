import { Pressable, View } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/**
 * A tappable row: title, optional detail, and either a small button (`actionLabel`) or a chevron.
 * With `actionLabel` the button is the target; without it the whole row is.
 */
export function ListRow({
  title,
  detail,
  actionLabel,
  onPress,
}: {
  title: string;
  detail?: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const c = theme.colors;
  const body = (
    <>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="heading">{title}</Text>
        {detail ? (
          <Text variant="bodySm" tone="secondary">
            {detail}
          </Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Button
          label={actionLabel}
          size="sm"
          onPress={onPress}
          accessibilityLabel={`${actionLabel}: ${title}`}
        />
      ) : (
        <Text variant="title2" tone="tertiary" accessibilityElementsHidden importantForAccessibility="no">
          {'›'}
        </Text>
      )}
    </>
  );
  const frame = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.space[3],
    minHeight: theme.minTarget + theme.space[3],
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[2],
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: c.borderSubtle,
    backgroundColor: c.surfaceSolid,
  };
  return actionLabel ? (
    <View style={frame}>{body}</View>
  ) : (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      onPress={onPress}
      style={({ pressed }) => [frame, pressed ? { backgroundColor: c.sunken } : null]}
    >
      {body}
    </Pressable>
  );
}
