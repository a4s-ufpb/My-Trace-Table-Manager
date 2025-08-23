// src/setupTests.js
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Adiciona TextEncoder e TextDecoder ao ambiente global do Jest
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;