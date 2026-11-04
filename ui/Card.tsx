import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';
import { shadow } from './tokens';

/** Standard card surface. */
export function Card({ children, style, ...rest }: ViewProps & { children: ReactNode }) {
  const theme = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: theme.colors.surfaceSolid,
          borderRadius: theme.radius.xl,
          borderWidth: 1,
          borderColor: theme.colors.borderSubtle,
          padding: theme.space[4],
          gap: theme.space[3],
        },
        theme.scheme === 'light' ? shadow.card : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** One problem, one card, one primary action. */
export function AttentionCard({
  title,
  detail,
  action,
  onAction,
  severity = 'info',
}: {
  title: string;
  detail?: string;
  action: string;
  onAction?: () => void;
  severity?: 'info' | 'attention' | 'safety';
}) {
  const theme = useTheme();
  const c = theme.colors;
  const bar = { info: c.info, attention: c.attention, safety: c.safety }[severity];
  return (
    <Card
      accessibilityRole={severity === 'safety' ? 'alert' : undefined}
      style={{ borderLeftWidth: 4, borderLeftColor: bar }}
    >
      <Text variant="heading" tone="heading">
        {title}
      </Text>
      {detail ? <Text tone="secondary">{detail}</Text> : null}
      <Button label={action} variant={severity === 'safety' ? 'safety' : 'primary'} onPress={onAction} />
    </Card>
  );
}
