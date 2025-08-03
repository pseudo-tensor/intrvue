'use client'
import './globals.css';
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
	  <html lang="en">
      <SessionProvider>
        <body className='font-light bg-gunmetal text-ghost-white font-zilla'>
          {children}
        </body>
      </SessionProvider>
	  </html>
	);
}
