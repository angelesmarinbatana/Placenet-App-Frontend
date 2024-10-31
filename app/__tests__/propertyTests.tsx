import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PropertyManagement from '../property';
import { Alert } from 'react-native';

describe('PropertyManagement Component',() => {
    beforeAll(()=> {
        jest.spyOn(Alert, 'alert');

    });
    afterEach(() => {
        (Alert.alert as jest.Mock).mockClear(); // Reset the alert mock between tests
      });
      test('renders the input field and button correctly', () => {
        const { getByPlaceholderText, getByText } = render(<PropertyManagement />);
    
        // Verify if the input field and button are rendered
        expect(getByPlaceholderText('Enter Property Address')).toBeTruthy();
        expect(getByText('Add Property')).toBeTruthy();
      });
      test('adds a property when valid input is entered', () => {
        const { getByPlaceholderText, getByText, getByDisplayValue } = render(<PropertyManagement />);
    
        const input = getByPlaceholderText('Enter Property Address');
        const button = getByText('Add Property');
    
        // Simulate user entering a property address
        fireEvent.changeText(input, '123 Main St');
        expect(getByDisplayValue('123 Main St')).toBeTruthy(); // Verify input value is displayed
    
        // Simulate button press to add the property
        fireEvent.press(button);
    
        // Check if the alert for success is shown
        expect(Alert.alert).toHaveBeenCalledWith('Successful!', 'Property has been added!');
    
        // Verify that the property is added to the list
        expect(getByText('123 Main St')).toBeTruthy();
      });
      test('shows error alert when adding an empty property', () => {
        const { getByText } = render(<PropertyManagement />);
    
        const button = getByText('Add Property');
    
        // Simulate button press without entering an address
        fireEvent.press(button);
    
        // Verify that the error alert is displayed
        expect(Alert.alert).toHaveBeenCalledWith('Error!', 'Property address cannot be empty!');
      });
    
      test('clears input field after adding a property', () => {
        const { getByPlaceholderText, getByText, queryByDisplayValue } = render(<PropertyManagement />);
    
        const input = getByPlaceholderText('Enter Property Address');
        const button = getByText('Add Property');
    
        // Simulate entering a valid property address
        fireEvent.changeText(input, '456 Elm St');
        fireEvent.press(button);
    
        // Verify input field is cleared after adding the property
        expect(queryByDisplayValue('456 Elm St')).toBeNull(); // Input should be cleared
      });
    
      test('renders multiple properties correctly', () => {
        const { getByPlaceholderText, getByText } = render(<PropertyManagement />);
    
        const input = getByPlaceholderText('Enter Property Address');
        const button = getByText('Add Property');
    
        // Add multiple properties
        fireEvent.changeText(input, '789 Oak St');
        fireEvent.press(button);
    
        fireEvent.changeText(input, '321 Pine St');
        fireEvent.press(button);
    
        // Verify both properties are displayed in the list
        expect(getByText('789 Oak St')).toBeTruthy();
        expect(getByText('321 Pine St')).toBeTruthy();
      });
    });
     