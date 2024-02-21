import "./globals.css";

export const metadata = {
  title: "Thrust Deployment App",
  description: "website hosting / deployment service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
