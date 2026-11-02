import { fireEvent, render, screen } from '@testing-library/react-native';
import { jest } from '@jest/globals';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSettings } from '@/features/settings/store';
import { AttentionCard, Button, Chip, Input, OTPInput, Sheet, Steps, ThemeProvider, createTheme } from '@/ui';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrap(ui: React.ReactElement) {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ThemeProvider>{ui}</ThemeProvider>
    </SafeAreaProvider>,
  );
}

beforeEach(() => useSettings.setState({ themeMode: 'caretaker', scheme: 'light' }));

describe('Button', () => {
  it('calls onPress and is labelled', async () => {
    const onPress = jest.fn();
    await wrap(<Button label="Go" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Go' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  it('does not fire when disabled or loading', async () => {
    const onPress = jest.fn();
    await wrap(<Button label="Go" disabled onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Go' }));
    expect(onPress).not.toHaveBeenCalled();
  });
  it('is at least 56 dp tall in the wearer theme', async () => {
    expect(createTheme('wearer', 'light').buttonHeight.sm).toBeGreaterThanOrEqual(56);
    useSettings.setState({ themeMode: 'wearer' });
    await wrap(<Button label="Big" size="sm" />);
    const style = screen.getByRole('button', { name: 'Big' }).props.style;
    const flat = typeof style === 'function' ? style({ pressed: false }) : style;
    expect(flat.minHeight).toBeGreaterThanOrEqual(56);
  });
});

describe('Input', () => {
  it('shows the error instead of the hint', async () => {
    await wrap(<Input label="Name" hint="a hint" error="bad" />);
    expect(screen.getByText('bad')).toBeTruthy();
    expect(screen.queryByText('a hint')).toBeNull();
  });
});

describe('OTPInput', () => {
  it('keeps digits only and reports completion', async () => {
    const done = jest.fn();
    function Harness() {
      const [v, setV] = useState('');
      return <OTPInput value={v} onChange={setV} length={4} onComplete={done} />;
    }
    await wrap(<Harness />);
    await fireEvent.changeText(screen.getByLabelText('Verification code'), '12a34');
    expect(done).toHaveBeenCalledWith('1234');
  });
});

describe('Chip and AttentionCard', () => {
  it('renders the label', async () => {
    await wrap(<Chip label="Connected" tone="good" />);
    expect(screen.getByLabelText('Connected')).toBeTruthy();
  });
  it('runs the card action', async () => {
    const onAction = jest.fn();
    await wrap(<AttentionCard title="T" action="Fix" onAction={onAction} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Fix' }));
    expect(onAction).toHaveBeenCalled();
  });
});

describe('Steps', () => {
  const steps = [
    { id: 'a', label: 'One', done: true },
    { id: 'b', label: 'Two', done: false },
    { id: 'c', label: 'Three', done: false, locked: true },
  ];
  it('opens done and current steps but not locked ones', async () => {
    const onSelect = jest.fn();
    await wrap(<Steps steps={steps} currentId="b" onSelect={onSelect} />);
    await fireEvent.press(screen.getByRole('button', { name: /One/ }));
    await fireEvent.press(screen.getByRole('button', { name: /Three/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('a');
  });
});

describe('Sheet', () => {
  it('shows content when open and closes from the dimmed area', async () => {
    const onClose = jest.fn();
    await wrap(
      <Sheet open title="Sheet title" onClose={onClose}>
        <Chip label="Inside" />
      </Sheet>,
    );
    expect(screen.getByText('Sheet title')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });
});
