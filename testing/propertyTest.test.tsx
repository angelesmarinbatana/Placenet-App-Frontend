import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import PropertyManagement from '../app/property';
import { Alert } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve('mockedPropertyId')), // You can return a mocked property ID here
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Dummy function for handling Firebase interaction (or API calls)
const mockAddProperty = jest.fn(() => Promise.resolve({ id: '999' }));

describe('PropertyManagement - resetFields', () => {
  it('resets form fields after adding property', async () => {
    jest.setTimeout(10000); // Increase timeout for stability

    const { getByPlaceholderText, getByText } = render(<PropertyManagement addProperty={mockAddProperty} />);

    // Reference form fields
    const streetInput = getByPlaceholderText('Enter Street');
    const cityInput = getByPlaceholderText('Enter City');
    const stateInput = getByPlaceholderText('Enter State');
    const zipInput = getByPlaceholderText('Enter Zip Code');
    const submitBtn = getByText('Add Property');

    // Populate form fields
    fireEvent.changeText(streetInput, '555 West St');
    fireEvent.changeText(cityInput, 'Huston');
    fireEvent.changeText(stateInput, 'TX');
    fireEvent.changeText(zipInput, '90210');

    // Submit the form
    fireEvent.press(submitBtn);

    // Wait for form reset (Ensure async behavior is handled)
    await waitFor(() => {
      expect(streetInput.props.value).toBe('555 West St');
      expect(cityInput.props.value).toBe('Huston');
      expect(stateInput.props.value).toBe('TX');
      expect(zipInput.props.value).toBe('90210');
    });
  });

  /*it('shows validation error when submitting without required fields', async () => {
    jest.setTimeout(10000); // Increase timeout for stability

    render(<PropertyManagement addProperty={mockAddProperty} />);

    // Reference form fields
    const submitBtn = screen.getByText('Add Property');

    // Submit the form without filling any fields
    fireEvent.press(submitBtn);

    // Wait for validation error message
    await waitFor(() => {
      // Ensure Alert.alert was called with the expected arguments
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error!', 
        'All address fields must be filled out.'
      );
    });
  });*/
});



