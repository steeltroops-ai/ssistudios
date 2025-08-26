import "@/styles/globals.css";
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
        <link
          rel="preload"
          href="/api/templates"
          as="fetch"
          crossOrigin="anonymous"
        />

        {/* DNS prefetching for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Prefetch likely next pages */}
        <link rel="prefetch" href="/dashboard" />
        <link rel="prefetch" href="/templates" />
        <link rel="prefetch" href="/poster/editor/poster1editor" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SSI Studios" />

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

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
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
