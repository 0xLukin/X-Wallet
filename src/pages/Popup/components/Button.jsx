import React from 'react';

import './Button.scss';

const Button = ({ prefix, suffix, value, onClick, styleClassName }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-[#E6E6E6] text-[#000] rounded-full hover:bg-[#1D9BF0] text-xs flex justify-center items-center ${styleClassName}`}
  >
    {prefix} {value}
    {suffix}
  </button>
);

export default Button;
