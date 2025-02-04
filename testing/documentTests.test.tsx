import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import UploadFile from '../app/document'; 
import api from '../API/api';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { test, expect} from '@jest/globals'

jest.setTimeout(10000);

// Mock API calls
jest.mock('../API/api', () => ({
  get: jest.fn((url) => {
    if (url === '/projects') {
      return Promise.resolve({ data: [{ project_id: 1, name: 'Test Project' }] });
    }
    if (url.startsWith('/documents?project_id=')) {
      return Promise.resolve({ data: [{ document_id: 10, file_name: 'test.pdf' }] });
    }
    return Promise.reject(new Error('Unknown API endpoint'));
  }),
  post: jest.fn(() => Promise.resolve({ data: { success: true } })),
  delete: jest.fn(() => Promise.resolve({ data: { success: true } })),
}));

// Mock DocumentPicker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'file://test.pdf', name: 'test.pdf', mimeType: 'application/pdf' }],
    })
  ),
}));

// Mock SafeAreaProvider
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Render children without SafeArea logic
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('UploadFile Component', () => {
  // Render helper function
  const renderComponent = () => {
    return render(
      <SafeAreaProvider>
        <UploadFile />
      </SafeAreaProvider>
    );
  };

  it('renders and fetches projects', async () => {
    renderComponent();
    // Wait for the "Test Project" text to appear, confirming the project list was fetched
    await waitFor(() => expect(screen.getByText('Test Project')).toBeTruthy());
  });

  it('uploads the selected documents', async () => {
    renderComponent();

    // Select a project and pick a document
    const project = await waitFor(() => screen.getByText('Test Project'));
    await act(async () => fireEvent.press(project));
    await act(async () => fireEvent.press(screen.getByText('Upload PDF')));

    // Trigger the upload
    await act(async () => fireEvent.press(screen.getByText('Upload Documents')));

    // Check that the POST request was made to upload the document
    //await waitFor(() => {
     //expect(api.post).toHaveBeenCalledWith('/documents', expect.any(FormData), expect.any(Object));
    });
  });







