import React from 'react';
import { Web3Provider } from './config/Web3Provider';
import Content from './components/Content';
import Header from './components/Header';

import './Popup.css';

const Popup = () => {
  return (
    <div className="App bg-[#F7F9F9] w-[350px] h-[375px]">
      <Web3Provider>
        {/* <header className="App-header">
          <Header />
        </header> */}
        <div className="App-body">
          <Content />
        </div>
      </Web3Provider>
    </div>
  );
};

export default Popup;
