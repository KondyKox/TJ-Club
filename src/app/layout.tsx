"use client";

import Footer from "@/components/layout/Footer";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
// import ThemeButton from "@/components/features/ThemeButton";
import { useNosChecker } from "@/hooks/useNosChecker";
import Modal from "@/components/ui/Modal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, modalText, closeModal } = useNosChecker();

  return (
    <html lang="pl">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <title>Tarnowska Mafia</title>
      </head>
      <body className="bg-primary text-secondary">
        {/* <ThemeButton /> */}
        <Navbar />
        <main>{children}</main>

        {/* Nos checker modal */}
        {isOpen && (
          <Modal isOpen={isOpen} onClose={closeModal}>
            <h1 className="sub-header mb-4">Nos 👃</h1>
            <p className="text-lg text-center text-gray-500">{modalText}</p>
          </Modal>
        )}

        <Footer />
      </body>
    </html>
  );
}
