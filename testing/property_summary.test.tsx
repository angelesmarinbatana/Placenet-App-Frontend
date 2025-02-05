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

  it('should show loading indicator when data is being fetched', async () => {
    // Simulating that the token is retrieved successfully from SecureStore
    SecureStore.getItemAsync.mockResolvedValue('mockToken');

    // Simulate the loading state by directly rendering the component without any data
    render(<PropertySummaryPage />);
    
    await waitFor(() => screen.getByText(''));
    // Ensure the loading spinner is visible (assuming the component has a loading spinner with a test ID)
    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
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

  it('should display property details when data is fetched successfully', async () => {
    // Directly simulate the data that would have been fetched
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

    // Simulate SecureStore returning a valid token
    SecureStore.getItemAsync.mockResolvedValue('mockToken');

    // Render the component with simulated properties
    render(<PropertySummaryPage properties={mockProperties} />);

    await waitFor(() => screen.getByText('Property Summary'));

    // Wait for the data to be rendered in the component
    await waitFor(() => screen.getByText('Project 1'));
    expect(screen.getByText('- Property 1')).toBeTruthy();
    expect(screen.getByText('- Project 1')).toBeTruthy();
    expect(screen.getByText('- Document 1')).toBeTruthy();
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

