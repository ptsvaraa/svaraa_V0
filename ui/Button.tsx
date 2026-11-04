import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'safety';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  /** Already-translated text. */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

/** One primary button per view. Red (safety) only for safety actions. */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth,
  disabled,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const c = theme.colors;
  const inactive = disabled || loading;
  const palette = {
    primary: { bg: c.action, pressed: c.actionPressed, fg: c.onAction, border: 'transparent' },
    secondary: { bg: 'transparent', pressed: c.sunken, fg: c.action, border: c.action },
    tertiary: { bg: 'transparent', pressed: c.sunken, fg: c.action, border: 'transparent' },
    safety: { bg: c.dangerSolid, pressed: c.dangerSolid, fg: c.onDanger, border: 'transparent' },
  }[variant];
  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      style={({ pressed }) => ({
        minHeight: Math.max(theme.buttonHeight[size], theme.minTarget),
        paddingHorizontal: theme.space[4],
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: palette.border,
        backgroundColor: pressed ? palette.pressed : palette.bg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: theme.space[2],
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        opacity: disabled ? 0.45 : 1,
      })}
    >
      {loading ? <ActivityIndicator color={palette.fg} /> : null}
      <View>
        <Text
          variant={size === 'sm' ? 'bodySm' : 'label'}
          style={{ color: palette.fg, fontWeight: undefined }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
