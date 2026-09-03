import "./globals.css";
import { DataProvider } from "../app/context/DataContext";
import { ThemeProvider } from "./components/ThemeProvider"; // Importera ThemeProvider
import { ClerkProvider } from "@clerk/nextjs";
import ChatBot from "./components/ChatBot";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "DRIVE AI CENTRALEN | Boka din trafikskola & utbildning",
  description: "Sveriges största marknadsplats för trafikskolor. Boka C-kort, YKB, Buss och ADR säkert online.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="sv" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <DataProvider>
              {children}
              <ChatBot />
            </DataProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}