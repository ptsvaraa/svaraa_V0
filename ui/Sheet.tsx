import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from './Text';
import { useTheme } from './ThemeProvider';

/** Bottom sheet. Tapping the dimmed area, the close button or the Android back button closes it. */
export function Sheet({
  open,
  title,
  onClose,
  children,
  actions,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const c = theme.colors;
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} accessibilityViewIsModal>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.close')}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: c.scrim, justifyContent: 'flex-end' }}
      >
        {/* Inner Pressable swallows taps so touches inside the sheet do not close it. */}
        <Pressable
          accessible={false}
          style={{
            backgroundColor: c.surfaceSolid,
            borderTopLeftRadius: theme.radius.xxl,
            borderTopRightRadius: theme.radius.xxl,
            padding: theme.space[5],
            paddingBottom: theme.space[5] + insets.bottom,
            gap: theme.space[4],
          }}
        >
          <View
            style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: c.border }}
          />
          <Text variant="title2" accessibilityRole="header">
            {title}
          </Text>
          {children}
          {actions}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
