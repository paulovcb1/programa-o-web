import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../__mocks__/server';
import ExpenseList from '../components/ExpenseList';

const mockTransactions = [
  { id: '1', description: 'Conta de Luz', amount: 100, category: 'Utilities', date: '2025-05-01', type: 'expense' },
  { id: '2', description: 'Internet', amount: 80, category: 'Utilities', date: '2025-05-02', type: 'expense' },
  { id: '3', description: 'Supermercado', amount: 300, category: 'Food', date: '2025-04-15', type: 'expense' },
  { id: '4', description: 'Academia', amount: 90, category: 'Health', date: '2025-05-01', type: 'expense' },
];

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// TC01: Exibe despesas do mês atual ao carregar
test('TC01: Exibe despesas do mês atual ao carregar', async () => {
  server.use(
    rest.get('http://localhost:3001/api/transactions', (req, res, ctx) => {
      const currentMonthTransactions = mockTransactions.filter(
        transaction => transaction.date.startsWith('2025-05')
      );
      return res(ctx.json(currentMonthTransactions));
    })
  );

  render(<ExpenseList userId="test-user" />);

  // Espera pelos elementos na tabela
  await waitFor(async () => {
    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header + pelo menos uma linha
  });

  // Verifica os itens do mês atual
  expect(screen.getByRole('cell', { name: 'Conta de Luz' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Internet' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Academia' })).toBeInTheDocument();
  expect(screen.queryByRole('cell', { name: 'Supermercado' })).not.toBeInTheDocument();
});

// TC02: Filtrar por mês
test('TC02: Filtrar despesas por mês', async () => {
  server.use(
    rest.get('http://localhost:3001/api/transactions', (req, res, ctx) => {
      return res(ctx.json(mockTransactions));
    })
  );

  render(<ExpenseList userId="test-user" />);
  const user = userEvent.setup();

  // Seleciona o mês de abril
  const monthSelect = screen.getByLabelText('Selecionar Mês');
  await user.selectOptions(monthSelect, '2025-04');

  await waitFor(async () => {
    expect(screen.getByRole('cell', { name: 'Supermercado' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Conta de Luz' })).not.toBeInTheDocument();
  });
});

// TC03: Filtrar despesas por categoria
test('TC03: Filtrar despesas por categoria', async () => {
  server.use(
    rest.get('http://localhost:3001/api/transactions', (req, res, ctx) => {
      return res(ctx.json(mockTransactions));
    })
  );

  render(<ExpenseList userId="test-user" />);
  const user = userEvent.setup();

  // Seleciona a categoria "Utilities"
  const categorySelect = screen.getByLabelText('Selecionar Categoria');
  await user.selectOptions(categorySelect, 'Utilities');

  await waitFor(async () => {
    expect(screen.getByRole('cell', { name: 'Conta de Luz' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Internet' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Academia' })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Supermercado' })).not.toBeInTheDocument();
  });
});

// TC04: Adicionar despesa válida
test('TC04: Adicionar nova despesa válida', async () => {
  const newExpense = {
    id: '5',
    description: 'Nova Despesa',
    amount: 150,
    category: 'Others',
    date: '2025-05-02',
    type: 'expense'
  };

  let requestBody: any;
  let lastGetResponse: any[] = mockTransactions;
  
  server.use(
    rest.get('http://localhost:3001/api/transactions', (req, res, ctx) => {
      console.log('Mock GET called, returning:', lastGetResponse);
      return res(ctx.json(lastGetResponse));
    }),
    rest.post('http://localhost:3001/api/transactions', async (req, res, ctx) => {
      requestBody = await req.json();
      console.log('Mock POST called with:', requestBody);
      lastGetResponse = [...mockTransactions, newExpense];
      return res(ctx.status(201), ctx.json(newExpense));
    })
  );

  render(<ExpenseList userId="test-user" />);
  const user = userEvent.setup();

  // Clica no botão de adicionar despesa
  await user.click(screen.getByRole('button', { name: /adicionar despesa/i }));

  // Preenche o formulário
  const form = screen.getByRole('form');
  await user.type(within(form).getByLabelText(/descrição/i), newExpense.description);
  await user.type(within(form).getByLabelText(/valor/i), newExpense.amount.toString());
  await user.selectOptions(within(form).getByLabelText(/categoria/i), newExpense.category);
  
  // Lida com o input de data de forma mais robusta
  const dateInput = within(form).getByLabelText(/data/i);
  await user.clear(dateInput);
  await user.type(dateInput, '2025-05-02');

  // Submete o formulário
  const submitButton = screen.getByRole('button', { name: /salvar/i });
  await user.click(submitButton);

  // Espera a requisição POST ser concluída e verifica o corpo
  await waitFor(() => {
    expect(requestBody).toBeDefined();
    expect(requestBody).toMatchObject({
      description: newExpense.description,
      amount: newExpense.amount,
      category: newExpense.category,
      date: newExpense.date,
      type: 'expense'
    });
  });

  // Espera a tabela ser atualizada e verifica o conteúdo
  await waitFor(() => {
    const cells = screen.getAllByRole('cell');
    console.log('Found table cells:', cells.map(cell => cell.textContent));
    const descriptionCell = screen.getByRole('cell', { name: newExpense.description });
    expect(descriptionCell).toBeInTheDocument();
  }, { timeout: 3000 });
});