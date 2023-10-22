import React, { useCallback } from 'react';

import './Footer.scss';

const Footer = ({ tabKey, onClick, onSendClick, disabled }) => {
  const handleTabClick = useCallback(
    (e) => {
      const { tabKey } = e.target.dataset;

      onClick?.(tabKey);
    },
    [onClick]
  );
  const isSend = tabKey === 'send';

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
