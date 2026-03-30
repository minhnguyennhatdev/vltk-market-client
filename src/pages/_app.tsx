import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@/utils/axios";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(App);
