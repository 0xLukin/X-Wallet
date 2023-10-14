import React from 'react';
import '../../styles.css';
import Popup from '../Popup/Popup';

export default function InjectedApp() {
  console.log('111111');
  const handleClick = () => {
    console.log('2222');
  };
  return (
    <div className=" w-[500px] h-[500px]">
      {/* <div
        id="AAclick"
        onClick={() => {
          console.log('sssss');
          handleClick();
        }}
      >
        这里有一个AA钱包～~~
      </div>
      <button
        onClick={() => {
          console.log('000');
        }}
      >
        hei
      </button> */}
      <Popup />
    </div>
  );
}
