/* eslint-disable @next/next/no-page-custom-font */
import { AppProps } from "next/app";
import Head from "next/head";
import {
  Global,
  MantineProvider,
  DEFAULT_THEME,
  MantineTheme,
} from "@mantine/core";
import { cache } from "@/utils/emotionCache";

export const theme: MantineTheme = {
  ...DEFAULT_THEME,
  fontFamily: "Lato, sans-serif",
  headings: {
    ...DEFAULT_THEME.headings,
    fontFamily: "Lato, sans-serif",
  },
  black: "#222",
  primaryColor: "blue",
};

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>POC</title>
        <meta name="description" content="poc" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={theme}
        emotionCache={cache}
      >
        <Global
          styles={(theme: any) => ({
            "*, *::before, *::after": {
              boxSizing: "border-box",
            },

            body: {
              margin: 0,
              padding: 0,
              ...theme.fn.fontStyles(),
              lineHeight: theme.lineHeight,
              maxHeight: "var(--vh, 100vh)",
              minHeight: "var(--vh, auto)",
            },

            html: {
              maxHeight: "-webkit-fill-available",
            },

            ".react-draggable ": {
              transform: "none !important",
            },
          })}
        />
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
