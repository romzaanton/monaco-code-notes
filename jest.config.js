module.exports = {
  browser: true,
  "collectCoverage": true,
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
    'ts',
    'tsx'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.ts?$': 'ts-jest',
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'monaco-editor': '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.main.js'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  transformIgnorePatterns: [ "/node_modules/(?!MODULE_NAME_HERE).+\\.js$"],
  testURL: 'http://192.168.99.1/'
}
