import { useId, useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';
import { fontFamily } from './fonts';
import { useTranslation } from 'react-i18next';

export type InputProps = Omit<TextInputProps, 'style'> & {
  /** Already-translated label, shown above the field. */
  label: string;
  hint?: string;
  error?: string;
};

/** Text field with a label above, optional hint, and an error message. */
export function Input({ label, hint, error, onFocus, onBlur, ...rest }: InputProps) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [focused, setFocused] = useState(false);
  const id = useId();
  const c = theme.colors;
  const note = error ?? hint;
  const t = theme.typeScale.body;
  return (
    <View style={{ gap: theme.space[1] }}>
      <Text variant="label" tone="secondary" nativeID={`${id}-label`}>
        {label}
      </Text>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityHint={note}
        aria-invalid={error ? true : undefined}
        placeholderTextColor={c.textTertiary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          minHeight: Math.max(theme.minTarget, 48),
          paddingHorizontal: theme.space[3],
          borderRadius: theme.radius.md,
          borderWidth: focused || error ? 2 : 1,
          borderColor: error ? c.safety : focused ? c.focus : c.border,
          backgroundColor: c.surfaceSolid,
          color: c.textPrimary,
          fontFamily: fontFamily(i18n.language, t),
          fontSize: t.size * theme.fontScale,
        }}
      />
      {note ? (
        <Text
          variant="bodySm"
          tone={error ? 'safety' : 'tertiary'}
          accessibilityRole={error ? 'alert' : undefined}
        >
          {note}
        </Text>
      ) : null}
    </View>
  );
}
