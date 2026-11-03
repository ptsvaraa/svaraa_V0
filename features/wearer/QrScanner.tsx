import { useRef } from 'react';
import { View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import { Button, Text, useTheme } from '@/ui';

/**
 * Camera viewfinder that reads one QR code. Asks for the camera first; if the person refused, says so
 * (the screen offers "Enter code instead"). `paused` stops reading while the code is being checked.
 */
export function QrScanner({ onScan, paused }: { onScan: (data: string) => void; paused?: boolean }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const last = useRef<{ data: string; at: number } | null>(null);
  const c = theme.colors;

  const frame = {
    height: 260,
    borderRadius: theme.radius.xl,
    overflow: 'hidden' as const,
    backgroundColor: c.sunken,
    borderWidth: 1.5,
    borderColor: c.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: theme.space[4],
    gap: theme.space[3],
  };

  if (!permission?.granted) {
    return (
      <View style={frame}>
        <Text tone="secondary" style={{ textAlign: 'center' }}>
          {permission && !permission.canAskAgain
            ? t('wearer.claim.cameraDenied')
            : t('wearer.claim.cameraAsk')}
        </Text>
        {permission?.canAskAgain !== false ? (
          <Button label={t('wearer.claim.allowCamera')} onPress={() => void requestPermission()} />
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ ...frame, padding: 0 }} accessibilityLabel={t('wearer.claim.viewfinder')}>
      <CameraView
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={
          paused
            ? undefined
            : ({ data }) => {
                // The camera reports the same code many times a second: pass it on at most every 3 s.
                const now = Date.now();
                if (last.current && last.current.data === data && now - last.current.at < 3000) return;
                last.current = { data, at: now };
                onScan(data);
              }
        }
      />
      {/* Aiming square */}
      <View
        style={{
          width: 180,
          height: 180,
          borderRadius: theme.radius.lg,
          borderWidth: 3,
          borderColor: c.accentSpirit,
        }}
      />
    </View>
  );
}
