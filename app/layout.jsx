export const metadata = {
  title: "Signal / Noise — Herwood Creative",
  description: "Is this brand signal or noise? A brand culture game by Herwood Creative.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0E1820" }}>{children}</body>
    </html>
  );
}
