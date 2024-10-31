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

  test('renders the input fields and button correctly', () => {
    const { getByPlaceholderText, getByText } = render(<PropertyManagement />);

    // Verify if the input fields and button are rendered
    expect(getByPlaceholderText('Enter Street')).toBeTruthy();
    expect(getByPlaceholderText('Enter City')).toBeTruthy();
    expect(getByPlaceholderText('Enter State')).toBeTruthy();
    expect(getByPlaceholderText('Enter Zip Code')).toBeTruthy();
    expect(getByText('Add Property')).toBeTruthy();
  });

  test('adds a property when valid input is entered', () => {
    const { getByPlaceholderText, getByText } = render(<PropertyManagement />);

    const streetInput = getByPlaceholderText('Enter Street');
    const cityInput = getByPlaceholderText('Enter City');
    const stateInput = getByPlaceholderText('Enter State');
    const zipInput = getByPlaceholderText('Enter Zip Code');
    const button = getByText('Add Property');

    // Simulate user entering a property address
    fireEvent.changeText(streetInput, '123 Main St');
    fireEvent.changeText(cityInput, 'Springfield');
    fireEvent.changeText(stateInput, 'IL');
    fireEvent.changeText(zipInput, '62701');

    // Simulate button press to add the property
    fireEvent.press(button);

    // Check if the alert for success is shown
    expect(Alert.alert).toHaveBeenCalledWith('Successful!', 'Property has been added!');

    // Verify that the property is added to the list
    expect(getByText('123 Main St, Springfield, IL 62701')).toBeTruthy();
  });

  test('shows error alert when adding an empty property', () => {
    const { getByText } = render(<PropertyManagement />);

    const button = getByText('Add Property');

    // Simulate button press without entering an address
    fireEvent.press(button);

    // Verify that the error alert is displayed
    expect(Alert.alert).toHaveBeenCalledWith('Error!', 'All address fields must be filled out!');
  });

  test('clears input fields after adding a property', () => {
    const { getByPlaceholderText, getByText, queryByDisplayValue } = render(<PropertyManagement />);

    const streetInput = getByPlaceholderText('Enter Street');
    const cityInput = getByPlaceholderText('Enter City');
    const stateInput = getByPlaceholderText('Enter State');
    const zipInput = getByPlaceholderText('Enter Zip Code');
    const button = getByText('Add Property');

    // Simulate entering a valid property address
    fireEvent.changeText(streetInput, '456 Elm St');
    fireEvent.changeText(cityInput, 'Shelbyville');
    fireEvent.changeText(stateInput, 'TN');
    fireEvent.changeText(zipInput, '37160');
    fireEvent.press(button);

    // Verify input fields are cleared after adding the property
    expect(queryByDisplayValue('456 Elm St')).toBeNull();
    expect(queryByDisplayValue('Shelbyville')).toBeNull();
    expect(queryByDisplayValue('TN')).toBeNull();
    expect(queryByDisplayValue('37160')).toBeNull();
  });

  test('renders multiple properties correctly', () => {
    const { getByPlaceholderText, getByText } = render(<PropertyManagement />);

    const streetInput = getByPlaceholderText('Enter Street');
    const cityInput = getByPlaceholderText('Enter City');
    const stateInput = getByPlaceholderText('Enter State');
    const zipInput = getByPlaceholderText('Enter Zip Code');
    const button = getByText('Add Property');

    // Add multiple properties
    fireEvent.changeText(streetInput, '789 Oak St');
    fireEvent.changeText(cityInput, 'Centerville');
    fireEvent.changeText(stateInput, 'OH');
    fireEvent.changeText(zipInput, '45459');
    fireEvent.press(button);

    fireEvent.changeText(streetInput, '321 Pine St');
    fireEvent.changeText(cityInput, 'Rivertown');
    fireEvent.changeText(stateInput, 'CA');
    fireEvent.changeText(zipInput, '90210');
    fireEvent.press(button);

    // Verify both properties are displayed in the list
    expect(getByText('789 Oak St, Centerville, OH 45459')).toBeTruthy();
    expect(getByText('321 Pine St, Rivertown, CA 90210')).toBeTruthy();
  });
});
