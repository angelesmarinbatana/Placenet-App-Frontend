import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Settings from '../app/settings_page';
import { useRouter } from 'expo-router';  // Import here for proper mocking
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mocking the useRouter hook
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock SafeAreaView and SafeAreaProvider correctly
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Mock SafeAreaView
}));

describe('Settings Page', () => {
  it('renders and has a logout button', async () => {
    render(
      <SafeAreaProvider>
        <Settings />
      </SafeAreaProvider>
    );

    // Check if the "Log out" button is rendered correctly
    expect(screen.getByText('Log out')).toBeTruthy();
  });
});



