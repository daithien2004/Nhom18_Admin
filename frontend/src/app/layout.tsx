import './globals.css';
import { Providers } from '../context/Providers';
import { Toaster } from 'sonner';
import AuthSync from '../components/AuthSync';

export const metadata = {
  title: 'ZaloUTE',
  description: 'ZaloUTE',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="mdl-js">
      <body>
        <Providers>
          <AuthSync />
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
