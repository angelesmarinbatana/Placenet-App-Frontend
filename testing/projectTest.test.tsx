import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ProjectManagement from '../app/project';
import { Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Firebase Firestore and Auth
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve()),
  }));

jest.mock('../firebaseConfig', () => ({
  auth: { currentUser: { uid: 'test-user-id' } }, // Mock user ID
  db: {},
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('ProjectManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });




  it('should fetch properties and display them', async () => {
    const mockProperties = [
      { id: '1', street: '123 Main St' },
      { id: '2', street: '456 Oak Ave' },
    ];

    getDocs.mockResolvedValueOnce({
      docs: mockProperties.map((property) => ({
        id: property.id,
        data: () => property,
      })),
    });

    render(<ProjectManagement />);

    // Wait for properties to be rendered
    await waitFor(() => screen.getByText('123 Main St'));
    await waitFor(() => screen.getByText('456 Oak Ave'));

    expect(screen.getByText('123 Main St')).toBeTruthy();
    expect(screen.getByText('456 Oak Ave')).toBeTruthy();
  });




  it('should select a property and fetch associated projects', async () => {
    const mockProperties = [
      { id: '1', street: '123 Main St' },
    ];

    const mockProjects = [
      { id: 'p1', name: 'Project 1', description: 'Description 1', completionDate: '2025-12-31T00:00:00Z' },
    ];

    getDocs
      .mockResolvedValueOnce({
        docs: mockProperties.map((property) => ({
          id: property.id,
          data: () => property,
        })),
      })
      .mockResolvedValueOnce({
        docs: mockProjects.map((project) => ({
          id: project.id,
          data: () => project,
        })),
      });

    render(<ProjectManagement />);

    // Wait for properties to be rendered
    await waitFor(() => screen.getByText('123 Main St'));

    // Select property
    fireEvent.press(screen.getByText('123 Main St'));

    expect(screen.getByText('Project Name:')).toBeTruthy();
    expect(screen.getByText('Project Description:')).toBeTruthy();
  });
 
});

