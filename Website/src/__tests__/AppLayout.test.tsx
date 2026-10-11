import { render, screen } from '@testing-library/react';
import AppLayout from '../components/layout/AppLayout';

describe('AppLayout', () => {
  it('renders children and header', () => {
    render(
      <AppLayout>
        <div>Test child</div>
      </AppLayout>
    );

    expect(screen.getByText('Test child')).toBeInTheDocument();
  });
});
