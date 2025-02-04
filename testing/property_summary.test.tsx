import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PropertySummaryPage from '../app/property_summary';
import api from '../API/api';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

afterEach(() => {
  jest.clearAllMocks();  // Clear mocks after each test
  jest.useRealTimers();  // Ensure any timers are cleared
});


// Mock API responses
jest.mock('../API/api');
jest.mock('expo-secure-store');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('PropertySummaryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator when data is being fetched', async () => {
    SecureStore.getItemAsync.mockResolvedValue('mockToken');
    api.get.mockResolvedValueOnce({ data: { Properties: [] } });

    render(<PropertySummaryPage />);

    // Ensure the loading spinner is visible
    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
  });

  it('should display error message if data fetch fails', async () => {
    SecureStore.getItemAsync.mockResolvedValue('mockToken');
    api.get.mockRejectedValueOnce(new Error('Network error'));

    render(<PropertySummaryPage />);

    // Wait for the error message to appear
    await waitFor(() => screen.getByText('Failed to load property summary. Please try again later.'));
    expect(screen.getByText('Failed to load property summary. Please try again later.')).toBeTruthy();
  });

  it('should display property details when data is fetched successfully', async () => {
    const mockProperties = [
      {
        property_id: 1,
        name: 'Property 1',
        Projects: [
          {
            project_id: 1,
            name: 'Project 1',
            Documents: [
              { document_id: 1, file_name: 'Document 1' },
            ],
          },
        ],
      },
    ];

    SecureStore.getItemAsync.mockResolvedValue('mockToken');
    api.get.mockResolvedValueOnce({ data: { Properties: mockProperties } });

    render(<PropertySummaryPage />);

    // Wait for the data to be rendered
    await waitFor(() => screen.getByText('Property 1'));
    expect(screen.getByText('Property 1')).toBeTruthy();
    expect(screen.getByText('- Project 1')).toBeTruthy();
    expect(screen.getByText('- Document 1')).toBeTruthy();
  });

  it('should navigate to the settings page when the Settings button is pressed', async () => {
    SecureStore.getItemAsync.mockResolvedValue('mockToken');
    api.get.mockResolvedValueOnce({ data: { Properties: [] } });

    render(<PropertySummaryPage />);

    // Press the settings button
    fireEvent.press(screen.getByText('Settings'));

    // Check if navigation happened
    expect(router.push).toHaveBeenCalledWith('/settings_page');
  });
});
