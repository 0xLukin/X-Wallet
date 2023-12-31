import { printLine } from './modules/print';
import React from 'react';
import ReactDOM from 'react-dom';
import InjectedApp from './InjectedApp';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

const injectedNode = document.createElement('div');
injectedNode.id = 'my-injected-app';
// document.body.prepend(injectedNode);

ReactDOM.render(<InjectedApp />, injectedNode);

const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const xpathExpression =
        '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[3]';
      const xpathResult = document.evaluate(
        xpathExpression,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      const targetDiv = xpathResult.singleNodeValue;
      if (targetDiv) {
        // 设置目标元素的父元素为 flex 容器
        // targetElement.parentNode.style.display = 'flex';
        ReactDOM.render(<InjectedApp />, targetDiv);

        // observer.disconnect(); // 如果你找到目标并注入后不再需要观察，可以断开连接
      }
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });
