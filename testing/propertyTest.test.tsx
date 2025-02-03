import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PropertyManagement from '../app/property';

// Mock API Call (submitting a form)
jest.mock('../API/api', () => ({
  post: jest.fn(() =>
    Promise.resolve({
      data: { property_id: 999, name: '555 West St, Huston, TX, 90210' }
    })
  ),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('PropertyManagement - resetFields', () => {
  it('resets form fields', async () => {
    jest.setTimeout(10000); // Increase timeout for stability

    const { getByPlaceholderText, getByText } = render(<PropertyManagement />);

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
      expect(streetInput.props.value).toBe('');
      expect(cityInput.props.value).toBe('');
      expect(stateInput.props.value).toBe('');
      expect(zipInput.props.value).toBe('');
    });

    // Additional check to verify if API was called correctly
    expect(require('../API/api').post).toHaveBeenCalledTimes(1);
  });
});
