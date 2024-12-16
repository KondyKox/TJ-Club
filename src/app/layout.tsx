import Footer from "@/components/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeButton from "@/components/ThemeButton";

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
      <body className="bg-primary text-secondary dark:bg-secondary dark:text-primary">
        <ThemeButton />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
