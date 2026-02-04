import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested (or standard)
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/language-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Creatye - Automação Instagram",
    description: "Plataforma de automação para Instagram",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
                <Toaster />
            </body>
        </html>
    );
}
