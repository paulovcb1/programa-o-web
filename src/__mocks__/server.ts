import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Handlers vazios inicialmente - os testes irão sobrescrever conforme necessário
const handlers = [];

export const server = setupServer(...handlers);