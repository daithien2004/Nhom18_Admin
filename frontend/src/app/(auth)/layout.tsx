import '../globals.css';

// app/(auth)/layout.tsx
import { Providers } from '../../context/Providers';
import { Toaster } from 'sonner';
import AuthSync from '../../components/AuthSync';

export const metadata = {
  title: 'ZaloUTE - Authentication',
  description: 'Login or Sign up to ZaloUTE',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-50">
        <Providers>
          <AuthSync />
          {/* Không có sidebar, chỉ có content */}
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
