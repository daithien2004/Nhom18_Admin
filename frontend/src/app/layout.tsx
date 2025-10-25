import "./globals.css";
import { Providers } from "../context/Providers";
import { Toaster } from "sonner";
import AuthSync from "../components/AuthSync";
import { Navigation } from "../components/Navigation";

export const metadata = {
  title: "ZaloUTE",
  description: "ZaloUTE",
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
          <Navigation />
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
