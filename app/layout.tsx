import "./globals.css";
import ClientRootLayout from "./ClientRootLayout";

export const metadata = {
  title: "SSI Studios Dashboard",
  description: "Automated poster creation system for SSI design team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Critical resource preloading */}
        <link
          rel="preload"
          href="/api/admin-login"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Critical CSS for instant rendering */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            .min-h-screen { min-height: 100vh; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .text-center { text-align: center; }
            .font-semibold { font-weight: 600; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .mb-2 { margin-bottom: 0.5rem; }
          `,
          }}
        />
      </head>
      <body className="relative text-white">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
