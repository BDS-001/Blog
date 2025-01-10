// jest.config.js
module.exports = {
    // Use Node.js environment
    testEnvironment: 'node',
    
    // Run setup file before tests
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    
    // Show detailed test output
    verbose: true,
    
    // Test timeout in milliseconds
    testTimeout: 10000,
    
    // Files to test
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    
    // Files to ignore
    testPathIgnorePatterns: ['/node_modules/'],
    
    // Stop running tests after the first failure
    bail: false,
    
    // Clear mock calls between every test
    clearMocks: true,
    
    // Collect test coverage information
    collectCoverage: true,
    
    // Directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    
    // Files to include in coverage
    collectCoverageFrom: [
      'controllers/**/*.js',
      'routes/**/*.js',
      'middleware/**/*.js',
      'prisma/queries/**/*.js'
    ]
  };