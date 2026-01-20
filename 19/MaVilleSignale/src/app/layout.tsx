import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MaVille Signale - Gestion des signalements municipaux',
  description: 'Application de gestion des signalements pour les agents municipaux',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
