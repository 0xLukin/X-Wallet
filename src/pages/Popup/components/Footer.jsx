import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import Button from './Button';

import ctx, { Provider, Consumer } from './appContext';

import SettingLogo from '../assets/svg/setting.png';

import './Footer.scss';

const Footer = ({ tabKey, onClick, onSendClick, disabled }) => {
  const handleTabClick = useCallback(
    (e) => {
      const { tabKey } = e.target.dataset;

      // routeTo(`/${tabKey}`);
      onClick?.(tabKey);
    },
    [onClick]
  );
  const isSend = tabKey === 'send';

  console.log(disabled, 'disableddisableddisabled');

  return (
    <div
      className={`footer-box ${
        isSend
          ? 'flex justify-center items-center text-white bg-[#1D9BF0] cursor-pointer'
          : ''
      }`}
      onClick={isSend ? onSendClick : null}
    >
      {isSend ? (
        <div>{disabled ? 'Loading...' : 'Send'}</div>
      ) : (
        <>
          <div
            className="footer-btn"
            data-active={tabKey === 'tokens'}
            style={{
              borderBottomLeftRadius: '20px',
            }}
            data-tab-key="tokens"
            onClick={handleTabClick}
          >
            Tokens
          </div>
          <div
            data-active={tabKey === 'nfts'}
            style={{
              borderBottomRightRadius: '20px',
            }}
            data-tab-key="nfts"
            className="footer-btn"
            onClick={handleTabClick}
          >
            NFTs
          </div>
        </>
      )}
    </div>
  );
};
export default Footer;
