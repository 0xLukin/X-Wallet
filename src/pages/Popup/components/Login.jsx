import React, { useState, useRef } from 'react';
import { configureChains, useConnect } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {
  SocialWalletConnector,
  TwitterSocialWalletConnector,
} from '@zerodev/wagmi';
import { TwitterSVG } from '../assets/svg/exportSvg';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const connector = new TwitterSocialWalletConnector({
  chains,
  options: {
    projectId: 'fc514f35-ed25-4100-97e6-90dd298a5d64',
  },
});

const socialConnector = new SocialWalletConnector({
  chains,
  options: {
    projectId: 'fc514f35-ed25-4100-97e6-90dd298a5d64',
  },
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { connect, isLoading } = useConnect();

  const connectWallet = async () => {
    setLoading(true);
    console.log('twitter');

    await connect({
      connector: connector,
    });

    setLoading(false);
  };

  return (
    <div className="">
      <div className="mt-16  bg-[#1D9BF0] text-white p-2 mx-8 rounded-full text-lg">
        <button disabled={isLoading} onClick={connectWallet}>
          <div className="flex">
            {isLoading || loading ? 'Loading...' : 'Connect to Twitter'}
            <div className="ml-1 mt-[1px]">
              <TwitterSVG />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
