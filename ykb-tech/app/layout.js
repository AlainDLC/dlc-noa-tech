import "./globals.css";
import { DataProvider } from "../app/context/DataContext"; // 1. Importera din nya Provider
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "YKB Market | Hitta din utbildning",
  description: "Boka YKB och ADR säkert online.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="sv">
        <body>
          {/* 2. Packa in {children} i DataProvider */}
          <DataProvider>{children}</DataProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
