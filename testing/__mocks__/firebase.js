const mockDatabaseRef = {
    push: jest.fn().mockReturnValue({
      set: jest.fn().mockResolvedValue(true),
    }),
  };
  
  const mockFirebase = {
    database: jest.fn(() => ({
      ref: jest.fn(() => mockDatabaseRef),
    })),
  };
  
  export default mockFirebase;