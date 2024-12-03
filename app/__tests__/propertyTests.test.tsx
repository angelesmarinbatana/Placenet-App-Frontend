import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PropertyManagement from '../property';
import { Alert } from 'react-native';

describe('PropertyManagement Component', () => {
  beforeAll(() => {
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    (Alert.alert as jest.Mock).mockClear(); // Reset the alert mock between tests
  });

  jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
      ...RN,
      Alert: {
        alert: jest.fn(), // Mock the Alert.alert function
      },
    };
  });

  test('renders the input fields and button correctly', () => {
    const { getByPlaceholderText, getByText } = render(<PropertyManagement />);

    // Verify if the input fields and button are rendered
    expect(getByPlaceholderText('Enter Street')).toBeTruthy();
    expect(getByPlaceholderText('Enter City')).toBeTruthy();
    expect(getByPlaceholderText('Enter State')).toBeTruthy();
    expect(getByPlaceholderText('Enter Zip Code')).toBeTruthy();
    expect(getByText('Add Property')).toBeTruthy();
  });

  test('shows error alert when adding an empty property', () => {
    const { getByText } = render(<PropertyManagement />);

    const button = getByText('Add Property');

    // Simulate button press without entering an address
    fireEvent.press(button);

    // Verify that the error alert is displayed
    expect(Alert.alert).toHaveBeenCalledWith('Error!', 'All address fields must be filled out!');
  });

  test('renders properties correctly', () => {
    const { getByPlaceholderText, getByText, getByDisplayValue } = render(<PropertyManagement />);

    const streetInput = getByPlaceholderText('Enter Street');
    const cityInput = getByPlaceholderText('Enter City');
    const stateInput = getByPlaceholderText('Enter State');
    const zipInput = getByPlaceholderText('Enter Zip Code');
    const button = getByText('Add Property');

    fireEvent.changeText(streetInput, '321 Pine St');
    fireEvent.changeText(cityInput, 'Rivertown');
    fireEvent.changeText(stateInput, 'CA');
    fireEvent.changeText(zipInput, '90210');
    fireEvent.press(button);

    // Verify both properties are displayed in the list
    expect(getByDisplayValue('321 Pine St')).toBeTruthy();
    expect(getByDisplayValue('Rivertown')).toBeTruthy();
    expect(getByDisplayValue('CA')).toBeTruthy();
    expect(getByDisplayValue('90210')).toBeTruthy();
  });
});

