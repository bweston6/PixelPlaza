import { Html, Head, Main, NextScript } from "next/document";

import Header from "../components/common/header.jsx";
import Footer from "../components/common/footer.jsx";

export default function Document() {
  return (
    <Html lang="en-GB">
      <Head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content="dark light" />
        <script
          src="https://kit.fontawesome.com/b1e088a62d.js"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Header />
        <Main />
        <Footer />
        <NextScript />
      </body>
    </Html>
  );
}
