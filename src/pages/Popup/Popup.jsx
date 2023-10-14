import React from 'react';
import './Popup.css';
import { Web3Provider } from './config/Web3Provider';
import Content from './components/Content';
import Header from './components/Header';

const Popup = () => {
  return (
    <div className="App">
      <Web3Provider>
        <header className="App-header">
          <Header />
        </header>
        <body className="App-body">
          <Content />
        </body>
      </Web3Provider>
    </div>
  );
};

export default Popup;
