export const metadata = {
  title: "Signal / Noise — Herwood Creative",
  description: "Is this brand a signal or noise? A brand culture game by Herwood Creative.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#B83A2A" }}>
        {children}
      </body>
    </html>
  );
}
