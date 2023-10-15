import React, { createContext, useCallback, useState, useContext } from 'react';
import { configureChains, useConnect } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {
  SocialWalletConnector,
  TwitterSocialWalletConnector,
} from '@zerodev/wagmi';
import { TwitterSVG } from '../assets/svg/exportSvg';
import WelcomeLogo from '../assets/svg/welcome-logo.png';

import ctx, { Provider, Consumer } from './appContext';

import './Login.css';

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

  const routerContext = useContext(ctx);

  console.log(routerContext, 'data1');
  console.log(routerContext?.routerLink, 'data1.routerLink');

  const connectWallet = useCallback(async () => {
    setLoading(true);
    console.log('twitter');

    await connect({
      connector: connector,
    });

    routerContext.routeTo('/home');

    setLoading(false);
  }, [connect, routerContext]);

  return (
    <div className="login">
      <img
        src={WelcomeLogo}
        alt=""
        className="welcome-logo mt-28"
        style={{ width: '240px', height: '80px' }}
      />
      <div className="bg-[#000] text-white mx-8 my-7 text-xs rounded-full w-36 h-8 leading-7 flex justify-center justify-items-center connect-btn">
        <button disabled={isLoading} onClick={connectWallet} className="">
          <div>
            {isLoading || loading ? 'Loading...' : 'Connect Wallet'}
            {/* <div className="ml-1 mt-[1px]">
              <TwitterSVG />
            </div> */}
          </div>
        </button>
      </div>
    </div>
  );
}
