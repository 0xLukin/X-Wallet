import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import Button from './Button';

import SettingLogo from '../assets/svg/setting.png';

import './Header.scss';

export default function Header() {
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

  return (
    <div className="flex justify-between items-center w-full p-3">
      <div className="twitter-name">
        <Button value={twitterName} />
      </div>
      <div className="flex justify-center setting-wrap">
        <Button value="Send" prefix="&uarr;" />
        <img src={SettingLogo} className="setting-logo" />
      </div>
    </div>
  );
}
