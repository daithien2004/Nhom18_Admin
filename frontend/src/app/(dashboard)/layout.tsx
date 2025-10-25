import '../globals.css';

// app/(dashboard)/layout.tsx
import { Providers } from '../../context/Providers';
import { Toaster } from 'sonner';
import AuthSync from '../../components/AuthSync';
import AdminSidebar from '../../components/layout/AdminSidebar';

export const metadata = {
  title: 'ZaloUTE - Admin Dashboard',
  description: 'ZaloUTE Admin Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="mdl-js">
      <body className="bg-gray-50">
        <Providers>
          <AuthSync />
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
