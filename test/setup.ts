import matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

// src: https://markus.oberlehner.net/blog/using-testing-library-jest-dom-with-vitest/
expect.extend(matchers)
