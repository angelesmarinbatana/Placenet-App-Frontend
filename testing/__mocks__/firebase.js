export const mockFirebaseConfig = {
    apiKey: 'fake-api-key',
    authDomain: 'fake-auth-domain.firebaseapp.com',
    projectId: 'fake-project-id',
    storageBucket: 'fake-storage-bucket.appspot.com',
    messagingSenderId: 'fake-sender-id',
    appId: 'fake-app-id',
  };
  
  const authMock = {
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '12345', email: 'test@example.com' } })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '12345', email: 'newuser@example.com' } })),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(),
  };
  
  const firestoreMock = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve()),
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({ name: 'Test User' }) })),
      })),
    })),
  };
  
  jest.mock('@react-native-firebase/app', () => ({
    initializeApp: jest.fn(() => Promise.resolve()),
    firestore: () => firestoreMock,
    auth: () => authMock,
  }));
  
  jest.mock('@react-native-firebase/auth', () => () => authMock);
  jest.mock('@react-native-firebase/firestore', () => () => firestoreMock);