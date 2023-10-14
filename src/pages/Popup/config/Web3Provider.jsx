import React, { useEffect, useState } from 'react';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
});

export function Web3Provider(props) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  console.log(wagmiConfig);
  return (
    <>
      {ready && (
        <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>
      )}
    </>
  );
}
