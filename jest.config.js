export default {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transforma arquivos TypeScript
      '^.+\\.jsx?$': 'babel-jest', // Transforma arquivos JavaScript com Babel
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Ignora arquivos de estilo
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Configuração adicional
    transformIgnorePatterns: ['<rootDir>/node_modules/'], // Ignora transformações em node_modules
  };