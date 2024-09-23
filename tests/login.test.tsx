import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from '../src/pages/login';
import './setup';

describe('Login Component', () => {
  it('renders email and password inputs correctly', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
