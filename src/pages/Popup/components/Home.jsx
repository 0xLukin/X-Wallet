import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import MintButton from './MintButton';
import Header from './Header';
import Footer from './Footer';
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
  return (
    <div className="home-container ">
      <Header />
      <HomePage />
      <div className="footer-wrap">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
