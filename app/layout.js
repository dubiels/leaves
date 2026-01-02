export const metadata = {
    title: "Leaves",
    description: "LinkedIn Queens but infinite",
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  }
  