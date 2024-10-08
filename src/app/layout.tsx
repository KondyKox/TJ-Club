import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <title>Tarnowska Mafia</title>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
