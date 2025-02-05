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
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TM75FS9H');</script>
        <!-- End Google Tag Manager -->
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <title>Tarnowska Mafia</title>
        <meta name="google-adsense-account" content="ca-pub-2534586073857624">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Oficjalna strona Tarnowskiej Mafii."
        />
        <meta
          name="keywords"
          content="Tarnowska Mafia, Ekipa Totalnych Pojebów, Banda Kretynów, Tarnów Jezierny"
        />
        <meta name="author" content="Tarnowska Mafia" />
      </head>
      <body className="bg-primary text-secondary">
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TM75FS9H"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
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
