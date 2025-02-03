import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ProjectManagement from '../app/project'; // Adjust path if necessary
import api from '../API/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mock API calls for GET (fetching properties)
jest.mock('../API/api', () => ({
  get: jest.fn((url) => {
    console.log(`Fetching URL: ${url}`); // Debug log to check which endpoint is hit
    if (url === '/properties') {
      console.log('Mocking properties data...'); // Ensure we hit the mock for properties
      return Promise.resolve({ data: [{ property_id: 1, name: 'Test Property' }] });
    }
    return Promise.reject(new Error('Unknown API endpoint'));
  })
}));

// Mock AsyncStorage to simulate selected property ID
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('1')), // Mocking that we always have a selected property
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('ProjectManagement Component', () => {
  it('renders and fetches properties', async () => {
    render(
      <SafeAreaProvider>
        <ProjectManagement />
      </SafeAreaProvider>
    );

    // Wait for the property to be rendered and ensure 'Test Property' is shown
    await waitFor(() => {
      console.log(screen.debug());  // Log the component's rendered output
      expect(screen.getByText('Test Property')).toBeTruthy();
    });
  });

  it('selects a property and fetches projects', async () => {
    render(
      <SafeAreaProvider>
        <ProjectManagement />
      </SafeAreaProvider>
    );

    // Wait for the property to appear and simulate selecting it
    const property = await waitFor(() => screen.getByText('Test Property'));
    fireEvent.press(property);

    // Ensure the selected property is shown
    expect(screen.getByText('Test Property')).toBeTruthy();
  });
});












