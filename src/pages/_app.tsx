import { NavBar, WalletContextProvider, WorkspaceProvider } from "@/components";
import { wrapper } from "@/store/store";
import { theme } from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

const MyApp = function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <WorkspaceProvider>
          <NavBar />
          <Component {...pageProps} />
        </WorkspaceProvider>
      </WalletContextProvider>
    </ChakraProvider>
  );
};

export default wrapper.withRedux(MyApp);
