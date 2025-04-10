import { ThemeProvider } from '@lobehub/ui';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider themeMode={'auto'}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
