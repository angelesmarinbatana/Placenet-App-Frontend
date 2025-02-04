export const auth = {
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '12345', email: 'test@example.com' } })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '67890', email: 'newuser@example.com' } })),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((callback) => callback({ uid: '12345', email: 'test@example.com' })),
};

export const db = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(() => Promise.resolve()),
      get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({ name: 'Test User' }) })),
    })),
  })),
};

export const storage = {
  ref: jest.fn(() => ({
    put: jest.fn(() => Promise.resolve()),
    getDownloadURL: jest.fn(() => Promise.resolve('https://mockurl.com/image.png')),
  })),
};

export const onAuthStateChanged = jest.fn((callback) => callback({ uid: 'mockUserId', email: 'mock@example.com' }));