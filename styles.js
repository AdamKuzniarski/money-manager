import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
:root{
  /* Light default */
  --background: #ffffff;
  --foreground: #111111;
  --surface: #f5f5f5;
  --muted: #6b7280;
  --border: #e5e7eb;
  --primary: #0a84ff;
  --positive: #16a34a;
  --negative: #dc2626;
  --badge-bg: #f0f0f0;
  --badge-text: #333;
}

/* Systempräferenz: Dark als Startbpunkt*/
@media (prefers-color-scheme: dark){
  :root{
    --background: #0b0f14;
      --foreground: #e6e6e6;
      --surface: #11161c;
      --muted: #9aa0a6;
      --border: #2a2f36;
      --primary: #0a84ff;
      --positive: #22c55e;
      --negative: #f87171;


  }
}
/* Explizit via Attribut gesetzt (überschreibt Systempräferenz) */
  html[data-theme="light"] {
    --background: #ffffff;
    --foreground: #111111;
    --surface: #f5f5f5;
    --muted: #6b7280;
    --border: #e5e7eb;
    --primary: #0a84ff;
    --positive: #16a34a;
    --negative: #dc2626;
    --badge-bg: #f0f0f0;
    --badge-text: #333;
  }

 html[data-theme="dark"] {
    --background: #0b0f14;
    --foreground: #e6e6e6;
    --surface: #11161c;
    --muted: #9aa0a6;
    --border: #2a2f36;
    --primary: #0a84ff;
    --positive: #22c55e;
    --negative: #f87171;
    --badge-bg: #333;
    --badge-text: #f0f0f0;

  }

 /* Baseline */
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #__next { height: 100%; }
  body {
    margin: 0;
    background: var(--background);
    color: var(--foreground);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 10px;
  }

  /* HTML ungestylete  Elemente */
  button {
    font: inherit;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--foreground);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
  }
  button:disabled { opacity: 0.6; cursor: not-allowed; }

  input, select {
    font: inherit;
    color: var(--foreground);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 0.6rem;
  }
 

`;

export default GlobalStyle;
