import { createContext } from 'react';
// 定义 context 对象
const context = createContext();

export const { Provider, Consumer } = context;

export default context;
