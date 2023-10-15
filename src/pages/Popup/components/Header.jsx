import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import Button from './Button';
import ctx, { Provider, Consumer } from './appContext';

import SettingLogo from '../assets/svg/setting.png';

import './Header.scss';

const Header = ({
  isHaveBack = false,
  isHaveSetting = false,
  isHaveSend = false,
  onClick,
}) => {
  const [twitterName, setTwitterName] = useState('');
  const { address, connector, isConnected } = useAccount();
  const routerContext = useContext(ctx);

  useEffect(() => {
    if (isConnected) {
      connector.web3Auth.getUserInfo().then((res) => {
        console.log(res);
        setTwitterName(res.name);
      });
    }
  }, [isConnected]);

  return (
    <div className="flex justify-between items-center w-full p-3 header-wrap">
      <>
        {isHaveBack ? (
          <Button value="&larr;" onClick={() => onClick('home')} />
        ) : (
          <div className="twitter-name">
            <Button value={`@${localStorage.getItem('handleName')}`} />
          </div>
        )}

        <div className="flex justify-center setting-wrap">
          {isHaveSend ? (
            <Button
              value="Send"
              prefix="&uarr;"
              onClick={() => onClick('send')}
            />
          ) : null}
          {isHaveSetting ? (
            <img
              src={SettingLogo}
              className="setting-logo"
              onClick={() => onClick?.('setting')}
            />
          ) : null}
        </div>
      </>
    </div>
  );
};

export default Header;
