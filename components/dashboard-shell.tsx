'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Gem, Wallet, Scale, Users, BellRing } from 'lucide-react';

const cards = [
  { title: 'Admin Stock', value: '0.000 g', icon: Gem },
  { title: 'Customer Holdings', value: '0.000 g', icon: Users },
  { title: 'Pending Bills', value: '0', icon: Wallet },
  { title: 'Reconciliation Alerts', value: '0', icon: BellRing },
  { title: 'Gold Rate / 10gm', value: '₹0', icon: Scale },
  { title: 'Security Status', value: 'Protected', icon: ShieldCheck }
];

export function DashboardShell({ role }: { role: string }) {
  return (
    <main className="p-6 md:p-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold capitalize">{role.replace('-', ' ')} dashboard</h1>
          <p className="text-slate-300">Enterprise controls with immutable stock traceability and audit monitoring.</p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-wide text-slate-300">{card.title}</h2>
                <Icon className="h-5 w-5 text-yellow-300" />
              </div>
              <p className="text-3xl font-semibold">{card.value}</p>
            </motion.article>
          );
        })}
      </div>
    </main>
  );
}
