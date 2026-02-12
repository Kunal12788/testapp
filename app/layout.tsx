import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jewellery Enterprise Platform',
  description: 'Enterprise jewellery inventory, allotment, billing and reconciliation platform.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
