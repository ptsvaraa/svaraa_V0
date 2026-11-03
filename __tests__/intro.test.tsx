import { act, fireEvent, screen } from '@testing-library/react-native';
import i18n from '@/i18n';
import Intro from '@/app/intro';
import { STORIES } from '@/features/intro/stories';
import { useSession } from '@/services/auth/session';
import { renderApp } from '@/test-utils/render';

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush, navigate: mockPush }),
}));

beforeEach(async () => {
  mockReplace.mockClear();
  mockPush.mockClear();
  await i18n.changeLanguage('en');
  useSession.setState({ showIntro: true });
});

describe('Intro (A3): the product story', () => {
  it('moves to the next story every 2 seconds and loops back to the first after the last', async () => {
    jest.useFakeTimers();
    await renderApp(<Intro />);
    expect(screen.getByLabelText('Page 1 of 7')).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(2000));
    expect(screen.getByLabelText('Page 2 of 7')).toBeTruthy();
    for (let i = 3; i <= 7; i++) {
      await act(async () => jest.advanceTimersByTime(2000));
      expect(screen.getByLabelText(`Page ${i} of 7`)).toBeTruthy();
    }
    await act(async () => jest.advanceTimersByTime(2000));
    expect(screen.getByLabelText('Page 1 of 7')).toBeTruthy();
    jest.useRealTimers();
  });

  it('has the seven Svaraas from the marketing site, in order', () => {
    expect(STORIES.map((s) => s.id)).toEqual([
      'recite',
      'respond',
      'remind',
      'rescue',
      'recall',
      'repository',
      'riddle',
    ]);
  });

  it('shows each story with its photo, name and headline', async () => {
    await renderApp(<Intro />);
    expect(screen.getByText('01 · Recite')).toBeTruthy();
    expect(screen.getByText(/A little calm,/)).toBeTruthy();
    expect(screen.getByText('Prayer, recitation and ambient sound, guided by voice.')).toBeTruthy();
    expect(screen.getByLabelText(/meditating side by side/)).toBeTruthy();
    expect(screen.getByText('07 · Riddle')).toBeTruthy();
  });

  it('is in Hindi when the language is Hindi', async () => {
    await i18n.changeLanguage('hi');
    await renderApp(<Intro />);
    expect(screen.getByText(/थोड़ी शांति,/)).toBeTruthy();
  });

  it('I have a Svaraa ends the intro and starts setup', async () => {
    await renderApp(<Intro />);
    await fireEvent.press(screen.getByRole('button', { name: 'I have a Svaraa' }));
    expect(useSession.getState().showIntro).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith('/home');
    expect(mockPush).toHaveBeenCalledWith('/setup');
  });

  it('Skip for now goes to Home', async () => {
    await renderApp(<Intro />);
    await fireEvent.press(screen.getByRole('button', { name: 'Skip for now' }));
    expect(useSession.getState().showIntro).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith('/home');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
