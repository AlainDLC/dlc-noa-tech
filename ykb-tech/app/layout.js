import "./globals.css";
import { DataProvider } from "../app/context/DataContext"; // 1. Importera din nya Provider

export const metadata = {
  title: "YKB Market | Hitta din utbildning",
  description: "Boka YKB och ADR säkert online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        {/* 2. Packa in {children} i DataProvider */}
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
