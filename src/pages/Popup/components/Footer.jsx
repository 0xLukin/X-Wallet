import React, { createContext, useCallback, useState, useContext } from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import Button from './Button';

import ctx, { Provider, Consumer } from './appContext';

import SettingLogo from '../assets/svg/setting.png';

import './Footer.scss';

const Footer = () => {
  const [twitterName, setTwitterName] = useState('');
  const { address, connector, isConnected } = useAccount();

  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { routeTo } = useContext(ctx);

  return (
    <div className="footer">
      <div onClick={() => routeTo('/tokens')}>Tokens</div>
      <div onClick={() => routeTo('/nfts')}>NFTs</div>
    </div>
  );
};
export default Footer;
