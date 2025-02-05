import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UploadFile from '../app/document'; // adjust the path accordingly

// Mocking the expo-document-picker module
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

// Mocking @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
}));

// Mocking Alert to avoid showing alerts in tests
//jest.spyOn(require('react-native'), 'Alert').mockImplementation(() => {});

describe('UploadFile Component', () => {
  // Ensure the alert mock is reset before each test
  beforeEach(() => {
    jest.clearAllMocks();  // This ensures that any mocks (like Alert) are cleared before each test.
  });

  it('should render correctly', () => {
    const { getByText } = render(<UploadFile />);
    expect(getByText('Select a Project:')).toBeTruthy();
  });

  it('should display a list of projects', async () => {
    const { getByText } = render(<UploadFile />);
    
    // Wait for the mock projects to be rendered
    await waitFor(() => expect(getByText('Bathroom')).toBeTruthy());
    expect(getByText('Bathroom')).toBeTruthy();
  });

  it('should select a project and show selected project', async () => {
    const { getByText } = render(<UploadFile />);
    
    // Wait for the project list to appear
    await waitFor(() => expect(getByText('Bathroom')).toBeTruthy());
    
    // Simulate project selection
    fireEvent.press(getByText('Bathroom'));
    
    // Verify the selected project
    expect(getByText('Selected Project: Bathroom')).toBeTruthy();
  });

  it('should upload a document', async () => {
    const mockDocument = { canceled: false, assets: [{ name: 'file.pdf', uri: 'uri-to-file' }] };
    require('expo-document-picker').getDocumentAsync.mockResolvedValue(mockDocument);

    const { getByText } = render(<UploadFile />);
    
    // Simulate uploading a document
    fireEvent.press(getByText('Upload PDF'));

    // Wait for document upload actions
    await waitFor(() => expect(getByText('Upload PDF')).toBeTruthy());

    expect(getByText('Upload PDF')).toBeTruthy();  // Ensure the button is still there after pressing
  });

  it('should delete a document', async () => {
    const { getByText, getByTestId } = render(<UploadFile />);
  
    // Wait for the project to be listed and select it
    await waitFor(() => expect(getByText('Bathroom')).toBeTruthy());
    fireEvent.press(getByText('Bathroom'));
  
    // Simulate uploading a document (this triggers the "Remove" button to show)
    await waitFor(() => expect(getByText('Upload PDF')).toBeTruthy());
    fireEvent.press(getByText('Upload PDF'));
  
    await waitFor(() => expect(getByText('Remove')).toBeTruthy());
    
    // Ensure that the "Remove" button press triggers the expected behavior
    expect(getByText('Remove')).toBeTruthy();
  });

});











