import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MainContainer from '../app/navigation_bar';
import { NavigationContainer } from '@react-navigation/native';


jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
}));

describe('Navigation Bar', () => {
  it('should render the correct screen names', () => {
    render(
      <MainContainer />
    );


    // Test for Project screen
    expect(screen.getByText('Project')).toBeTruthy();

    // Test for Property screen
    expect(screen.getByText('Property')).toBeTruthy();

    // Test for Document screen
    expect(screen.getByText('Document')).toBeTruthy();

    // Test for Profile screen
    expect(screen.getByText('Profile')).toBeTruthy();

    // Test for Listings screen (Social)
    expect(screen.getByText('Social')).toBeTruthy();
  });
});


