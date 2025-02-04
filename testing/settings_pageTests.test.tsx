import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Settings from '../app/settings_page'; // Adjust the import path if needed
import { useRouter } from 'expo-router';

// Mocking the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock SafeAreaView for tests
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Settings Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  test('renders Settings screen with Log out button', () => {
    const { getByText } = render(<Settings />);

    // Check if the Log out button is rendered
    expect(getByText('Log out')).toBeTruthy();
  });

  test('navigates to the sign_in screen when the Log out button is pressed', () => {
    const { getByText } = render(<Settings />);

    // Press the Log out button
    fireEvent.press(getByText('Log out'));

    // Check if router.push was called with the correct route
    expect(pushMock).toHaveBeenCalledWith('/sign_in');
  });
});




