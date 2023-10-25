import React, { useContext, useState, createContext, useCallback } from 'react';
import ctx, { Provider, Consumer } from './appContext';
import Login from './Login';
import { useAccount } from 'wagmi';
import Home from './Home';

export const linkUrls = {
  login: '/login',
  home: '/home',
  send: '/send',
  tokens: '/tokens',
};

export const linkContext = createContext({ routerLink: '/' });

export default function Content() {
  const { isConnected } = useAccount();

  const [routerLink, setRouterLink] = useState(linkUrls.login);
  const [userInfo, setUserInfo] = useState({});
  const routeTo = (url) => setRouterLink(url);

  const renderContent = useCallback(() => {
    switch (routerLink) {
      case linkUrls.login:
        return <Login />;
      case linkUrls.home:
        return <Home />;
      case linkUrls.send:
        // return <Send />;
        break;
      default:
        return <Login />;
    }
  }, [routerLink]);

  return (
    <div className="h-full w-full">
      <Provider value={{ routerLink, routeTo, userInfo, setUserInfo }}>
        {isConnected ? renderContent() : <Login />}
      </Provider>
    </div>
  );
}
