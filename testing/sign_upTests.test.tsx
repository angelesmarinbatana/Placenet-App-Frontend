import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignUpPage from '../app/sign_up'; // Adjust the import path if necessary
import { Alert } from 'react-native';
import '@testing-library/jest-native/extend-expect';


jest.mock('./__mocks__/firebaseConfig');

jest.mock('@react-native-firebase/auth', () => () => ({
  createUserWithEmailAndPassword: jest.fn((email, password) => 
    Promise.resolve({ user: { uid: '12345', email } })
  ),
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mocking expo-router's useRouter hook for navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  if (buttons && Array.isArray(buttons) && buttons[0] && typeof buttons[0].onPress === 'function') {
    buttons[0].onPress();  // Safely call the onPress function
  }
});

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));



describe('SignUpPage', () => {
  let pushMock: jest.Mock<any, any, any>;
  let mockAuth: any;

  beforeEach(() => {
    pushMock = jest.fn();
    mockAuth = require('@react-native-firebase/auth')();
  });

  test('renders correctly', () => {
    render(
      <SafeAreaProvider>
        <SignUpPage />
      </SafeAreaProvider>
    );
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  test('shows error message when passwords do not match', async () => {
    render(
      <SafeAreaProvider>
        <SignUpPage />
      </SafeAreaProvider>
    );

    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'password321');
    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => expect(screen.getByText('Passwords do not match!')).toBeTruthy());
    
  });
});
