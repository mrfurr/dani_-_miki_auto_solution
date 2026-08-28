import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dani & Miki Auto Solution",
  description: "Advanced Garage Booking and Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="darkreader-lock" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
