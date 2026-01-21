import '../styles/globals.css'

export const metadata = {
  title: 'Agricultural Credit & Commodity Management System',
  description: 'Manage loans, warehouse receipts, and commodity trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}