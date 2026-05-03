import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders the MERN CRUD app', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledTimes(4);
  });

  expect(screen.getByText(/MERN CRUD/i)).toBeInTheDocument();
});
