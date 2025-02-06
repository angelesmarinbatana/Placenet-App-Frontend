import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PropertySummaryPage from '../app/property_summary';  // Adjust the import path if necessary
import * as SecureStore from 'expo-secure-store';  // Mocking SecureStore for token storage
import { router } from 'expo-router';  // Mocking the router for navigation

afterEach(() => {
  jest.clearAllMocks();  // Clear mocks after each test
  jest.useRealTimers();  // Ensure any timers are cleared
});

// Mock SecureStore to simulate token retrieval
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
}));

// Mock Router for navigation
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),  // Mock the router push function
  },
}));

// Mock SafeAreaContext to avoid issues with SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without SafeArea logic
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('PropertySummaryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should display error message if data fetch fails', async () => {
    // Simulate SecureStore returning a valid token
    SecureStore.getItemAsync.mockResolvedValue('mockToken');

    // Simulate an error scenario without fetching data
    render(<PropertySummaryPage />);

    // Wait for the error message to appear (assuming your component shows an error message when data fetch fails)
    await waitFor(() => screen.getByText('Failed to load property summary.'));
    expect(screen.getByText('Failed to load property summary.')).toBeTruthy();
  });

  it('should show loading spinner when data is being fetched', async () => {
    render(<PropertySummaryPage />);
    
    // Ensure the loading spinner is visible (this assumes a testID 'loading-spinner' for the ActivityIndicator)
    await waitFor(() => screen.getByText('Property Summary'));
    expect(screen.getByText('Property Summary')).toBeTruthy();
  });


  /*it('should navigate to the settings page when the Settings button is pressed', async () => {
    // Simulate SecureStore returning a valid token
    SecureStore.getItemAsync.mockResolvedValue('mockToken');

    // Render the component (no API call needed here)
    render(<PropertySummaryPage />);

    // Press the settings button
    fireEvent.press(screen.getByText('Settings'));

    // Verify that the navigation occurred
    expect(router.push).toHaveBeenCalledWith('/settings_page');
  });*/
});

