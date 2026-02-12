'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';

const roleRouteMap: Record<string, string> = {
  FIRST_ADMIN: '/dashboard?role=first-admin',
  SECOND_ADMIN: '/dashboard?role=second-admin',
  THIRD_ADMIN: '/dashboard?role=third-admin',
  FOURTH_ADMIN: '/dashboard?role=fourth-admin',
  MAIN_ADMIN: '/dashboard?role=main-admin',
  CUSTOMER: '/dashboard?role=customer'
};

export function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error || 'Login failed');
      setLoading(false);
      return;
    }

    window.location.href = roleRouteMap[json.role] ?? '/dashboard';
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="glass-card mx-auto w-full max-w-md space-y-5 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="text-2xl font-semibold">Jewellery Enterprise Login</h1>
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl bg-white/10 p-3" />
      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="w-full rounded-xl bg-white/10 p-3"
      />
      {error ? <p className="rounded-xl bg-red-500/20 p-3 text-red-200">{error}</p> : null}
      <button
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-brand-gold to-yellow-500 p-3 font-semibold text-black transition hover:scale-[1.01]"
      >
        {loading ? 'Authenticating...' : 'Login'}
      </button>
    </motion.form>
  );
}
