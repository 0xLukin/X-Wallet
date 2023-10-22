import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useAccount, useDisconnect, useNetwork, useBalance } from 'wagmi';
import { message } from 'antd';
import Header from './Header';
import Footer from './Footer';
import Button from './Button';
import Send from './Send';

import { addressFormat } from '../utils';

import './Home.scss';

export const urlFormat = (url) =>
  'https://raw.githubusercontent.com/0xLukin/x-wallet-ethhangzhou/main/src/pages/Popup/assets/svg/' +
  url +
  '.png';

const Home = () => {
  const { address, connector, isConnected } = useAccount();
  const sendRef = useRef(null);

  const { data: maticData, isError } = useBalance({
    address: localStorage.getItem('accountAddress'),
    watch: true,
  });

  // TODO: 增加全币种的余额对象 AccountPair，用于Home 和Send 的展示和选择，并且只需要查询一次
  const accountPair = useMemo(
    () => [
      {
        key: 'matic',
        name: 'Matic',
        symbol: urlFormat('matic'),
        decimals: 18,
        account: maticData?.formatted,
      },
      {
        key: 'eth',
        name: 'ETH',
        symbol: urlFormat('eth'),
        decimals: 18,
        account: '0',
      },
      {
        key: 'btc',
        name: 'BTC',
        symbol: urlFormat('btc'),
        decimals: 18,
        account: '0',
      },
      {
        key: 'bnb',
        name: 'BNB',
        symbol: urlFormat('bnb'),
        decimals: 18,
        account: '0',
      },
    ],
    [maticData]
  );

  const { disconnect } = useDisconnect();
  const [tabKey, setTabKey] = useState('home');
  const [isSendProgress, setIsSendProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        localStorage.getItem('accountAddress')
      );
      message.info('sucessed copied.');
    } catch (error) {
      console.error('Failed to copy code to clipboard:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const CopyBtn = (
    <div className="copy-btn">
      <img
        style={{ width: '9px', height: '14px' }}
        src={urlFormat('copy')}
        alt=""
      />
    </div>
  );

  const HomeContent = () => {
    return (
      <>
        <div className="address" onClick={handleCopy}>
          <Button
            value={addressFormat(localStorage.getItem('accountAddress'))}
            suffix={CopyBtn}
          />
        </div>
        <div className="unit">net Worth</div>
        <div className="worth">${`${Number(maticData?.formatted) * 0.5}`}</div>
      </>
    );
  };

  const nftsList = useMemo(
    () => [
      {
        name: 'MINMIN Art',
        symbols: [
          'qbrady_eyes',
          'qbrady_manga',
          'qbrady_kanjigirl',
          'qbrady_warrior',
        ].map((item) => urlFormat(item)),
      },
      {
        name: 'Maka Baka',
        symbols: [urlFormat('qbrady_kodama')],
      },
    ],
    []
  );

  const settingList = useMemo(
    () => ['Security', 'Activity', 'Manage Accounts', 'Nostr key', 'Quit'],
    []
  );

  const BaseList = ({ listData, renderItem, renderItemExtend }) => {
    return (
      <div className="base-list-wrap">
        {listData?.map((item) => {
          return (
            <>
              <div key={item.name} className="base-list-wrap-item">
                {renderItem?.(item)}
              </div>
              <div>{renderItemExtend?.(item)}</div>
            </>
          );
        })}
      </div>
    );
  };

  const handleTokensListRender = (item) => {
    return (
      <div className="token-item">
        <div className="name-wrap">
          <div className="token-symbol">
            <img src={item.symbol} alt="" className="w-[21px]" />
          </div>
          <div className="token-name">{item.name}</div>
        </div>
        <div className="token-account">{item.account}</div>
      </div>
    );
  };
  const handleNftsListRender = (item) => {
    return (
      <div className="token-item">
        <div className="token-title">{item.name}</div>
        <div className="token-extend">
          <img src={urlFormat('arrow_down')} alt="" className="w-[15px]" />
        </div>
      </div>
    );
  };

  const handleRenderItemExtend = (item) => {
    const { symbols } = item;
    return (
      <div className="mx-[22px] flex gap-2.5 symbols-wrap">
        {symbols?.length
          ? symbols.map((nft) => (
              <img
                src={nft}
                alt=""
                key={nft}
                className="w-[107px] rounded-2xl"
              />
            ))
          : null}
      </div>
    );
  };

  const handleSettingListRender = useCallback(
    (item) => {
      const isQuit = item === 'Quit';

      return (
        <div
          className={`token-item ${isQuit ? 'flex justify-center' : null}`}
          onClick={isQuit ? disconnect : null}
        >
          <div className="token-title">{item}</div>
          {!isQuit && (
            <div className="token-extend">
              <img src={urlFormat('arrow_right')} alt="" className="w-[8px]" />
            </div>
          )}
        </div>
      );
    },
    [disconnect]
  );

  const renderContent = useCallback(() => {
    switch (tabKey) {
      case 'tokens':
        return (
          <BaseList
            listData={accountPair}
            renderItem={handleTokensListRender}
          />
        );
      case 'nfts':
        return (
          <BaseList
            listData={nftsList}
            renderItem={handleNftsListRender}
            renderItemExtend={handleRenderItemExtend}
          />
        );
      case 'setting':
        return (
          <BaseList
            listData={settingList}
            renderItem={handleSettingListRender}
          />
        );

      default:
        return <HomeContent />;
    }
  }, [handleSettingListRender, nftsList, settingList, tabKey, accountPair]);

  const isSend = tabKey === 'send';

  const handleFooterSendClick = useCallback(() => {
    if (
      sendRef.current &&
      typeof sendRef.current.handleSendClick === 'function'
    ) {
      sendRef.current.handleSendClick();
    }
  }, []);

  return (
    <div className="home-container ">
      <Header
        isHaveBack={tabKey !== 'home'}
        isHaveSend={tabKey === 'home'}
        isHaveSetting={tabKey === 'home' || tabKey === 'setting'}
        onClick={setTabKey}
      />
      <div className="content-wrap">
        {isSend ? (
          <Send
            accountPair={accountPair}
            back={() => setTabKey('home')}
            isSendProgress={isSendProgress}
            handleLoading={setLoading}
            ref={sendRef}
          />
        ) : (
          renderContent()
        )}
      </div>
      {tabKey !== 'setting' && (
        <div className="footer-wrap">
          <Footer
            tabKey={tabKey}
            onClick={setTabKey}
            onSendClick={handleFooterSendClick}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
