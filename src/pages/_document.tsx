import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/logo.png?v=1" />
        <link rel="shortcut icon" type="image/png" href="/logo.png?v=1" />
        <link rel="apple-touch-icon" href="/logo.png?v=1" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
