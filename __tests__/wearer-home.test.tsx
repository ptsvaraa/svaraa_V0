import { act, fireEvent, screen } from '@testing-library/react-native';
import i18n from '@/i18n';
import Home from '@/app/(tabs)/home';
import { useHousehold } from '@/features/household/store';
import { usePendant } from '@/features/pendant/store';
import { useSettings } from '@/features/settings/store';
import { useWearer } from '@/features/wearer/store';
import { verifyOtpAndSignIn } from '@/services/auth/authApi';
import { useSession } from '@/services/auth/session';
import { DEMO_CODE } from '@/services/mocks/routes';
import { pendant, resetPendant, SIMULATED_PENDANT, simulatorTiming } from '@/services/pendant';
import { INDIA, useMockBackend } from '@/test-utils/backend';
import { renderApp } from '@/test-utils/render';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: mockPush, navigate: mockPush, back: jest.fn() }),
}));

const flush = () => act(async () => await new Promise((r) => setTimeout(r, 0)));

beforeEach(async () => {
  mockPush.mockClear();
  Object.assign(simulatorTiming, { found: 0, connect: 0, check: 0 });
  resetPendant();
  usePendant.setState({ connection: 'disconnected', battery: undefined });
  await i18n.changeLanguage('en');
  useSettings.setState({ themeMode: 'wearer', scheme: 'light' });
  await useMockBackend();
  await verifyOtpAndSignIn(INDIA, DEMO_CODE);
  const userId = useSession.getState().userId as string;
  await useHousehold.getState().load(userId);
  await useWearer.getState().load(userId);
  await useHousehold.getState().chooseRole('wearer', 'h1');
  await useWearer.getState().save({
    profile: { name: 'Asha Rao', call_as: 'Amma', languages: ['ta'], pacemaker: false },
    pendantId: SIMULATED_PENDANT.id,
    contacts: [
      { name: 'Meera', countryCode: '+91', mobile: '9812344410' },
      { name: 'Ravi', countryCode: '+91', mobile: '9912347821' },
    ],
  });
});

describe('E2 · Wearer Home', () => {
  it('keeps the setup card until the pendant is Active', async () => {
    await renderApp(<Home />);
    expect(screen.getByText('Finish setting up Svaraa')).toBeTruthy();
    expect(screen.queryByText('My people')).toBeNull();
  });

  it('once Active: greets by the chosen name, reconnects and shows Protected with the battery', async () => {
    await useHousehold.getState().activate();
    await renderApp(<Home />);
    await flush();
    expect(screen.getByText('Hello, Amma')).toBeTruthy();
    expect(screen.queryByText('Finish setting up Svaraa')).toBeNull();
    expect(pendant().getStatus().connection).toBe('connected');
    expect(screen.getByText('Protected')).toBeTruthy();
    expect(screen.getByText('Pendant 82% · connected')).toBeTruthy();
    expect(screen.getByText('Meera, Ravi')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Run SOS drill' }));
    expect(mockPush).toHaveBeenCalledWith('/wearer/drill');
  });

  it('says when the wearer is not protected', async () => {
    await useHousehold.getState().activate();
    await useWearer.getState().save({ pendantId: undefined });
    await renderApp(<Home />);
    await flush();
    expect(screen.getByText('Not protected right now')).toBeTruthy();
    expect(screen.getByText('Pendant not connected')).toBeTruthy();
  });
});
