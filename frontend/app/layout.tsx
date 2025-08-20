export const metadata = { title: "Last Man Standing" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin:0, fontFamily:"Inter, sans-serif" }}>{children}</body>
    </html>
  );
}
