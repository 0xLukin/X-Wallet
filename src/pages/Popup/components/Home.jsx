import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { message } from 'antd';
import Header from './Header';
import Footer from './Footer';
import Button from './Button';
import { addressFormat } from '../utils';

import Copy from '../assets/svg/copy.png';
import BTC from '../assets/svg/btc.png';
import BNB from '../assets/svg/bnb.png';
import ETH from '../assets/svg/eth.png';
import Matic from '../assets/svg/matic.png';
import QbradyEyes from '../assets/svg/qbrady_eyes.png';
import QbradyManga from '../assets/svg/qbrady_manga.png';
import ArrowDown from '../assets/svg/arrow_down.png';
import ArrowRight from '../assets/svg/arrow_right.png';
import Kanjigirl from '../assets/svg/qbrady_kanjigirl.png';
import Kodama from '../assets/svg/qbrady_kodama.png';
import Warrior from '../assets/svg/qbrady_warrior.png';

import { ZeroDevWeb3Auth } from '@zerodev/web3auth';

import './Home.scss';

const HomePage = () => {
  const [twitterName, setTwitterName] = useState('');
  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  useEffect(() => {
    if (isConnected) {
      connector.web3Auth.getUserInfo().then((res) => {
        console.log(res);
        setTwitterName(res.name);
      });
    }
  }, [isConnected]);

  console.log(isConnected, 'isConnected---home');
  console.log(address, 'address---home');

  return (
    <div>
      {/* <div className="p-2 bg-white border rounded shadow-lg"> */}
      {/* <div className="mb-2">
        <div className="text-gray-700">Connected Address:</div>
        <div className="font-semibold">
          {address?.slice(0, 6)}
          ...
          {address?.slice(-6)}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-gray-700">Connected to:</div>
        <div className="font-semibold">
          {connector.name} {twitterName}
        </div>
      </div>

      <a
        href={`${chain.blockExplorers.default.url}/address/${address}`}
        target="_blank"
        className="text-blue-500 hover:underline"
        rel="noreferrer"
      >
        Explore on Etherscan
      </a>

      <button
        onClick={disconnect}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Disconnect
      </button>
      <MintButton /> */}
    </div>
  );
};

const Home = () => {
  const { address, connector, isConnected } = useAccount();

  const { disconnect } = useDisconnect();

  const [tabKey, setTabKey] = useState('home');

  console.log(tabKey, 'tabkey,,,,');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('789asda4..4285');
      message.info('sucessed copied.');

      console.log('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code to clipboard:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const CopyBtn = (
    <div className="copy-btn">
      <img style={{ width: '9px', height: '14px' }} src={Copy} alt="" />
    </div>
  );

  const HomeContent = () => {
    return (
      <>
        <div className="address" onClick={handleCopy}>
          <Button value={addressFormat(address)} suffix={CopyBtn} />
        </div>
        <div className="unit">net Worth</div>
        <div className="worth">{`$ 123479.89`}</div>
      </>
    );
  };

  const tokensList = useMemo(
    () => [
      {
        name: 'ETH',
        symbol: ETH,
        decimals: 18,
        account: '102879',
      },
      {
        name: 'BTC',
        symbol: BTC,
        decimals: 18,
        account: '80',
      },
      {
        name: 'BNB',
        symbol: BNB,
        decimals: 18,
        account: '1085',
      },
      {
        name: 'Matic',
        symbol: Matic,
        decimals: 18,
        account: '125',
      },
      {
        name: 'Matic',
        symbol: Matic,
        decimals: 18,
        account: '125',
      },
      {
        name: 'Matic',
        symbol: Matic,
        decimals: 18,
        account: '125',
      },
      {
        name: 'Matic',
        symbol: Matic,
        decimals: 18,
        account: '125',
      },
    ],
    []
  );
  const nftsList = useMemo(
    () => [
      {
        name: 'MINMIN Art',
        symbols: [QbradyEyes, QbradyManga, Kanjigirl, Warrior],
      },
      {
        name: 'Maka Baka',
        symbols: [Kodama],
      },
    ],
    []
  );

  const settingList = useMemo(
    () => ['Security', 'Activity', 'Manage Accounts', 'Nostr key', 'Quit'],
    []
  );

  const handleAccountChange = (account) => {};
  const handleAddressChange = (address) => {};

  const sendList = useMemo(
    () => [
      {
        label: ' ',
        value: '',
        onChange: () => {},
      },
      {
        label: 'Account',
        value: '',
        onChange: handleAccountChange,
      },
      {
        label: 'Address',
        value: '',
        onChange: handleAddressChange,
      },
    ],
    []
  );

  const BaseList = ({ listData, renderItem, renderItemExtend }) => {
    return (
      <div className="base-list-wrap">
        {listData.map((item) => {
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
          <img src={ArrowDown} alt="" className="w-[15px]" />
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
              <img src={ArrowRight} alt="" className="w-[8px]" />
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
          <BaseList listData={tokensList} renderItem={handleTokensListRender} />
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
      case 'send':
        return (
          <>
            {sendList.map((item) => (
              <SendItem {...item} key={item.label} />
            ))}
          </>
        );

      default:
        return <HomeContent />;
    }
  }, [
    handleSettingListRender,
    nftsList,
    sendList,
    settingList,
    tabKey,
    tokensList,
  ]);

  const SendItem = ({ label, keyword, value, onChange }) => {
    return (
      <div className="flex justify-center">
        <div className="label-style">{label}</div>
        <input type="text" value={value} onChange={onChange} />
      </div>
    );
  };

  return (
    <div className="home-container ">
      <Header
        isHaveBack={tabKey !== 'home'}
        isHaveSend={tabKey === 'home'}
        isHaveSetting={tabKey === 'home' || tabKey === 'setting'}
        onClick={setTabKey}
      />
      <div className="content-wrap">{renderContent()}</div>
      {tabKey !== 'setting' && (
        <div className="footer-wrap">
          <Footer tabKey={tabKey} onClick={setTabKey} />
        </div>
      )}
    </div>
  );
};

export default Home;
