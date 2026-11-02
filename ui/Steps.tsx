import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** `done`: finished (green). `locked`: not reachable yet, so it cannot be opened. */
export type Step = { id: string; label: string; done: boolean; locked?: boolean };

/** Setup progress. Done steps can be revisited; steps ahead of your progress are locked. */
export function Steps({
  steps,
  currentId,
  onSelect,
}: {
  steps: Step[];
  currentId: string;
  onSelect: (id: string) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const c = theme.colors;
  const index = Math.max(
    0,
    steps.findIndex((s) => s.id === currentId),
  );
  return (
    <View
      accessibilityLabel={t('steps.progress', { current: index + 1, total: steps.length })}
      style={{ gap: theme.space[1] }}
    >
      {steps.map((s, i) => {
        const current = s.id === currentId;
        const circle = s.done ? c.good : current ? c.action : 'transparent';
        const state = s.done
          ? t('steps.done')
          : current
            ? t('steps.current')
            : s.locked
              ? t('steps.locked')
              : '';
        return (
          <View key={s.id}>
            <Pressable
              disabled={s.locked}
              onPress={() => onSelect(s.id)}
              accessibilityRole="button"
              accessibilityLabel={state ? `${s.label}, ${state}` : s.label}
              accessibilityState={{ disabled: !!s.locked, selected: current }}
              style={{
                minHeight: theme.minTarget,
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.space[3],
                opacity: s.locked ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: circle,
                  borderWidth: 2,
                  borderColor: s.done ? c.good : current ? c.action : c.border,
                }}
              >
                <Text variant="caption" style={{ color: s.done || current ? c.onAction : c.textSecondary }}>
                  {s.done ? '✓' : String(i + 1)}
                </Text>
              </View>
              <Text
                variant="body"
                tone={current ? 'heading' : 'secondary'}
                style={current ? { fontWeight: '600' } : undefined}
              >
                {s.label}
              </Text>
            </Pressable>
            {i < steps.length - 1 ? (
              <View
                style={{
                  width: 2,
                  height: theme.space[3],
                  marginLeft: 13,
                  backgroundColor: s.done ? c.good : c.border,
                }}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
