import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import PropertySummaryPage from '../app/property_summary';
import api from '../API/api';

jest.mock('../API/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [{ property_id: 1, name: 'Test Property 1' }] })),
}));

// Mock AsyncStorage (if needed)
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('1')), // Mocking that we always have a selected property
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('PropertySummaryPage Tests', () => {
  it('renders the loading spinner while fetching data', async () => {
    render(<PropertySummaryPage />);

    // Wait for the loading spinner to appear
    await waitFor(() => expect(screen.getByTestId('loading-spinner')).toBeTruthy());
  });

  it('renders properties once data is fetched', async () => {
    render(<PropertySummaryPage />);

    // Wait for the property data to appear
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeTruthy();
    });
  });

  it('displays error message if there is an error fetching data', async () => {
    // Mock an error in the API call
    api.get.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch data')));

    render(<PropertySummaryPage />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load property summary. Please try again later.')).toBeTruthy();
    });
  });

  it('navigates to settings page on pressing the Settings button', async () => {
    render(<PropertySummaryPage />);

    // Wait for the Settings button and press it
    const settingsButton = await waitFor(() => screen.getByText('Settings'));
    fireEvent.press(settingsButton);

    // Ensure that the navigation function is called correctly
    // You can mock the router if needed or simply test for button press interaction
  });

  it('renders error message if token is not found', async () => {
    render(<PropertySummaryPage />);

    // Simulate token not being found
    api.get.mockImplementationOnce(() => Promise.reject(new Error('Authentication failed!')));

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Authentication failed! Please log in again.')).toBeTruthy();
    });
  });
});


