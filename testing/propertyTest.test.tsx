import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PropertyManagement from '../app/property';

  
  //Mock post (submitting a form)
  jest.mock('../API/api', () => ({
    post: jest.fn(() => Promise.resolve({ 
      data: { property_id: 999, name: '555 West St, Huston, TX, 90210' } 
    }))
  }));

  jest.mock('react-native-safe-area-context', () => ({
      SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
      SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    }));
  
  describe('PropertyManagement - resetFields', () => {
    it('resets form fields', async () => {
      const { getByPlaceholderText, getByText } = render(<PropertyManagement />);
  
    //reference
      const streetInput = getByPlaceholderText('Enter Street');
      const cityInput   = getByPlaceholderText('Enter City');
      const stateInput  = getByPlaceholderText('Enter State');
      const zipInput    = getByPlaceholderText('Enter Zip Code');
      const submitBtn   = getByText('Add Property');
  
     //populate
      fireEvent.changeText(streetInput, '555 West St');
      fireEvent.changeText(cityInput, 'Huston');
      fireEvent.changeText(stateInput, 'TX');
      fireEvent.changeText(zipInput, '90210');
  
      //submit
      fireEvent.press(submitBtn);
  
      //wait for async 
      await waitFor(() => {
        //should reset to empty string
        expect(streetInput.props.value).toBe('');
        expect(cityInput.props.value).toBe('');
        expect(stateInput.props.value).toBe('');
        expect(zipInput.props.value).toBe('');
      });
    });
  });