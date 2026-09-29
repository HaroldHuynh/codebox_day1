import "./globals.css";

export const metadata = {
  title: "Goodies | Buy and sell used goods",
  description: "Find useful secondhand goods from people in your community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
