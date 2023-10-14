import React from 'react';
import Login from './Login';
import { useAccount } from 'wagmi';
import Home from './Home';

export default function Content() {
  const { isConnected } = useAccount();

  return (
    <div className="h-full w-full">
      {isConnected ? <Home isConnected={isConnected} /> : <Login />}
    </div>
  );
}
