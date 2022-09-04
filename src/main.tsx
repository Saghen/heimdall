import { render } from "preact";
import { Router } from "./router";
import { Global, css } from "@emotion/react";
import { colors } from "@constants";

const globalStyles = css`
  @font-face {
    font-family: 'Nunito';
    font-style: normal;
    font-display: swap;
    src: url('/Nunito.ttf') format('ttf');
  }

  @font-face {
    font-family: 'Nunito';
    font-style: italic;
    font-display: swap;
    src: url('/Nunito-Italic.ttf') format('ttf');
  }

  html {
    font-size: 10px;
  }

  body {
    margin: 0;

    background-color: ${colors.bg[500]};
    color: ${colors.text.primary};

    font-size: 1.4rem;

    --red: ${colors.red};
  }

  body,
  input,
  button {
    font-family: "Nunito", "Roboto", systemui, sans-serif;
  }

  a {
    text-decoration: none;
  }
`;

render(
  <>
    <Global styles={globalStyles} />
    <Router />
  </>,
  document.getElementById("app") as HTMLElement
);
