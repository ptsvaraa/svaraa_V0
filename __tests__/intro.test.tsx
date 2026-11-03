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
  it('moves to the next story every 3 seconds and loops back to the first', async () => {
    jest.useFakeTimers();
    await renderApp(<Intro />);
    expect(screen.getByLabelText('Page 1 of 3')).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('Page 2 of 3')).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('Page 3 of 3')).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('Page 1 of 3')).toBeTruthy();
    jest.useRealTimers();
  });

  it('has three stories from the marketing site: voice, reminders, SOS', () => {
    expect(STORIES.map((s) => s.id)).toEqual(['respond', 'remind', 'rescue']);
  });

  it('shows each story with its photo, name and headline', async () => {
    await renderApp(<Intro />);
    expect(screen.getByText('01 · Respond')).toBeTruthy();
    expect(screen.getByText(/A familiar voice\./)).toBeTruthy();
    expect(screen.getByText(/thoughtful support/)).toBeTruthy();
    expect(screen.getByLabelText(/chatting during a walk/)).toBeTruthy();
  });

  it('is in Hindi when the language is Hindi', async () => {
    await i18n.changeLanguage('hi');
    await renderApp(<Intro />);
    expect(screen.getByText(/जानी-पहचानी आवाज़/)).toBeTruthy();
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
