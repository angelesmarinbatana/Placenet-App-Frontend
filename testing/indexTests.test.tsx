import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import IndexPage from '../app/index'; // Adjust the import path if needed
import { useRouter } from 'expo-router';

// Mock the useRouter hook
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock SafeAreaView for tests
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));

describe('IndexPage Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  test('renders IndexPage with buttons and text', () => {
    const { getByText, getByTestId } = render(<IndexPage />);

    // Check if the title and subtitle are rendered correctly
    expect(getByText('Welcome to Placenet!')).toBeTruthy();
    expect(getByText('For property and community care')).toBeTruthy();

    // Check if the buttons are rendered correctly
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  test('navigates to sign_in page when Sign In button is pressed', () => {
    const { getByText } = render(<IndexPage />);

    fireEvent.press(getByText('Sign In'));

    expect(pushMock).toHaveBeenCalledWith('/sign_in');
  });

  test('navigates to sign_up page when Sign Up button is pressed', () => {
    const { getByText } = render(<IndexPage />);

    fireEvent.press(getByText('Sign Up'));

    expect(pushMock).toHaveBeenCalledWith('/sign_up');
  });
});
