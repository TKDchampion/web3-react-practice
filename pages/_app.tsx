import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK");

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  // library.pollingInterval = 5000
  return library;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default MyApp;
