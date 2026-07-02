import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PulseTrace — Stories from the community",
    description: "A modern feed of stories curated by writers on PulseTrace. Discover, read, and follow your favorite authors.",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col">
        {children}
        </body>
        </html>
    );
}
