export const metadata = {
    title: "Queens Game",
    description: "A fun interactive Queens placement game",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    );
  }
  