import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../__mocks__/server';
import ExpenseList from '../components/ExpenseList';
import TransactionForm from '../components/TransactionForm';

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
test('TC01: Exibe todas as despesas ao carregar', async () => {
  server.use(
    rest.get('http://localhost:3001/api/transactions', (_, res, ctx) => {
      const currentMonthTransactions = mockTransactions.filter(
        transaction => transaction.date.startsWith('2025-05')
      );
      return res(ctx.json(currentMonthTransactions));
    })
  );

  render(<ExpenseList userId="test-user" />);

  await waitFor(async () => {
    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); 
  });

  expect(screen.getByRole('cell', { name: 'Conta de Luz' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Internet' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Academia' })).toBeInTheDocument();
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
      return res(ctx.json(lastGetResponse));
    }),
    rest.post('http://localhost:3001/api/transactions', async (req, res, ctx) => {
      requestBody = await req.json();
      lastGetResponse = [...mockTransactions, newExpense];
      return res(ctx.status(201), ctx.json(newExpense));
    })
  );

  render(<ExpenseList userId="test-user" />);
  const user = userEvent.setup();

  await user.click(screen.getByRole('button', { name: /adicionar despesa/i }));

  const form = screen.getByRole('form');
  await user.type(within(form).getByLabelText(/descrição/i), newExpense.description);
  await user.type(within(form).getByLabelText(/valor/i), newExpense.amount.toString());
  await user.selectOptions(within(form).getByLabelText(/categoria/i), newExpense.category);

  const dateInput = within(form).getByLabelText(/data/i);
  await user.clear(dateInput);
  await user.type(dateInput, '2025-05-02');

  const submitButton = screen.getByRole('button', { name: /salvar/i });
  await user.click(submitButton);

  
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

 
  await waitFor(() => {
    screen.getAllByRole('cell');
   
    const descriptionCell = screen.getByRole('cell', { name: newExpense.description });
    expect(descriptionCell).toBeInTheDocument();
  }, { timeout: 3000 });
});


test('TC05: Exibir mensagens de erro para campos obrigatórios inválidos', async () => {
  const mockOnSubmit = jest.fn();
  render(<TransactionForm onSubmit={mockOnSubmit} />);

  const user = userEvent.setup();

  const form = screen.getByTestId('transaction-form');


  const amountInput = within(form).getByLabelText('Valor');
  await user.clear(amountInput);
  await user.type(amountInput, '0'); 

  const descriptionInput = within(form).getByLabelText('Descrição');
  await user.clear(descriptionInput); 

  const categorySelect = within(form).getByLabelText('Categoria');
  await user.selectOptions(categorySelect, ''); 

  const dateInput = within(form).getByLabelText('Data');
  await user.clear(dateInput); 

  const submitButton = screen.getByRole('button', { name: /adicionar transação/i });
  await user.click(submitButton);

  await waitFor(() => {
    const errorMessages = screen.getAllByRole('listitem'); 
    expect(errorMessages).toHaveLength(4); 
    expect(errorMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textContent: expect.stringContaining('O campo "Valor" deve ser maior que zero.') }),
        expect.objectContaining({ textContent: expect.stringContaining('O campo "Descrição" é obrigatório.') }),
        expect.objectContaining({ textContent: expect.stringContaining('O campo "Categoria" é obrigatório.') }),
        expect.objectContaining({ textContent: expect.stringContaining('O campo "Data" é obrigatório.') }),
      ])
    );
  });

  expect(mockOnSubmit).not.toHaveBeenCalled();
});


