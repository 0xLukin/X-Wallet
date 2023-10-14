import React from 'react';
import SidebarButton from './SidebarButton';
import { UserSVG } from '../assets/svg/exportSvg';
import { useAccount } from 'wagmi';

export default function Header() {
  const { isConnected } = useAccount();
  return (
    <div className="flex justify-between items-center w-full ">
      <SidebarButton />
      <div className=" font-bold text-xl text-black">X-Wallet</div>
      <div className={!isConnected && 'opacity-0 pointer-events-none'}>
        <UserSVG />
      </div>
    </div>
  );
}
