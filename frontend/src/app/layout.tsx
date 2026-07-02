import type {Metadata} from "next";
import {Fira_Code} from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "PulseTrace — Stories from the community",
    description: "A modern feed of stories curated by writers on PulseTrace. Discover, read, and follow your favorite authors.",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={`${firaCode.className} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
        {children}
        </body>
        </html>
    );
}
