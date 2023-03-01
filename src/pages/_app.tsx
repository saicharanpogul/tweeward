
import { NavBar, WalletContextProvider } from "@/components";
import { theme } from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <NavBar />
        <Component {...pageProps} />
      </WalletContextProvider>
    </ChakraProvider>
  );
}
