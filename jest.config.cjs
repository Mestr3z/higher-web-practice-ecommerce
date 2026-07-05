module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  moduleNameMapper: {
    '\\.svg\\?react$': '<rootDir>/src/test/svgMock.tsx',
    '\\.(png|jpe?g|gif|webp)$': '<rootDir>/src/test/fileMock.ts',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
};
