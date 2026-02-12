'use client';

import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <motion.form className="glass w-full space-y-4 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold">Unified Login</h1>
        <input className="w-full rounded-xl border border-slate-500 bg-slate-900/60 p-3" placeholder="Email" type="email" required />
        <input className="w-full rounded-xl border border-slate-500 bg-slate-900/60 p-3" placeholder="Password" type="password" required />
        <button className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-amber-500 p-3 font-semibold transition hover:scale-[1.02]">Sign In</button>
      </motion.form>
    </div>
  );
}
