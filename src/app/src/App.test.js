import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: '1', title: 'Sample Task 1', completed: false },
          { id: '2', title: 'Sample Task 2', completed: true },
        ]),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders List of TODOs and Create a ToDo sections', async () => {
  render(<App />);

  expect(screen.getByText(/Create a ToDo/i)).toBeInTheDocument();
  expect(screen.getByText(/List of TODOs/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add ToDo!/i })).toBeInTheDocument();

  // Wait for mock todos to be rendered
  await waitFor(() => {
    expect(screen.getByText('Sample Task 1')).toBeInTheDocument();
  });
});
