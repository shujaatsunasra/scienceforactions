import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Science for Action | Join Science-Driven Causes in Your Community',
  description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world.',
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Science for Action</h1>
        <p className="mb-4">Redirecting to main page...</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function() {
                window.location.href = '/main/';
              }, 1000);
            `
          }}
        />
        <noscript>
          <meta httpEquiv="refresh" content="1; url=/main/" />
        </noscript>
        <a href="/main" className="text-blue-600 underline">
          Click here if not redirected automatically
        </a>
      </div>
    </main>
  );
}

