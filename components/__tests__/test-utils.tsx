import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';

export function renderWithProviders(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
}

