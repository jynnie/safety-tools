import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="og:title"
            property="og:title"
            content="RPG Safety Tools"
          />
          <meta property="og:url" content="https://safety.vercel.app/" />
          <meta
            name="og:description"
            content="Quickly set up anonymous lines and veils for your group. Based off TTRPG Safety Toolkit and the RPG Consent Checklist. For tabletop and other roleplaying games."
          />
          <meta property="og:image" content="/clip.png" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:creator" content="@jynniit" />

          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
