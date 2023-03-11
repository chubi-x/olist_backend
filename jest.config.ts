import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  preset: 'ts-jest/presets/default-esm',
  roots: ['test/'],
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/'
  ]
}

export default config
