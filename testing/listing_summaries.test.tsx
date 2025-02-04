import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import ListingSummariesPage from '../app/listing_summaries';
import api from '../API/api';
import * as SecureStore from 'expo-secure-store';

// Mock the API call and SecureStore
jest.mock('../API/api');
jest.mock('expo-secure-store');

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ListingSummariesPage', () => {
  it('should show loading spinner while data is being fetched', async () => {
    // Mock a successful API call with no properties to check for loading
    api.get.mockResolvedValueOnce({ data: [] });
    SecureStore.getItemAsync.mockResolvedValueOnce('fake_token');  // Mocking the token

    render(<ListingSummariesPage />);

    // Wait for the component to fetch the data (simulate loading phase)
    await waitFor(() => expect(screen.queryByTestId('loading-indicator')).toBeTruthy());
  });
  

  it('should show error message when API call fails', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to fetch'));  // Mock API failure
    SecureStore.getItemAsync.mockResolvedValueOnce('fake_token');

    render(<ListingSummariesPage />);

    // Wait for the error message
    await waitFor(() => screen.getByText('Failed to load property summary. Please try again later.'));

    // Ensure error message is displayed
    expect(screen.getByText('Failed to load property summary. Please try again later.')).toBeTruthy();
  });
});

