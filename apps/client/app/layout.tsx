import './globals.css';
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
	  <html lang="en">
			<body className='font-light bg-gunmetal text-ghost-white font-zilla'>
				{children}
			</body>
	  </html>
	);
}
