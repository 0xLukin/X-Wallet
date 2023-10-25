import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { message, Select } from 'antd';

import { useAccount, useDisconnect, useNetwork, useBalance } from 'wagmi';
import { useWallet } from '../hooks/useWallet';
import { addressFormat } from '../utils';

const Send = React.forwardRef(
  ({ accountPair = [], back, handleSend, handleLoading }, ref) => {
    const { address, connector, isConnected } = useAccount();
    const [account, setAccount] = useState('');
    const [twitterName, setTwitterName] = useState('');
    const [targetAddress, setTargetAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // TODO: 需要增加各币种的转账
    const { getaddress, sendETH, sendERC20 } = useWallet();

    const [currentCoin, setCurrentCoin] = useState(accountPair?.[0].key);
    const handleAccountChange = useCallback((event) => {
      setAccount(event.target.value);
    }, []);
    const handleNameChange = useCallback(
      (e) => setTwitterName(e.target.value),
      []
    );
    const handleGetAddress = async (e) => {
      const name = e.target.value;

      setLoading(true);

      // 检查 name 是否符合以太坊地址的格式
      const isEthereumAddress = /^0x[0-9a-fA-F]{40}$/.test(name);

      if (isEthereumAddress) {
        // 如果是以太坊地址，直接使用 name 作为目标地址
        setTargetAddress(name);
        setLoading(false);
      } else {
        // 如果不是以太坊地址，调用 getaddress 函数获取地址
        const res = await getaddress(name);
        if (res?.['account_address']) {
          setTargetAddress(res?.['account_address']);
        } else {
          message.error(res.error);
          setTargetAddress('');
        }
        setLoading(false);
      }
    };

    const handleSendClick = useCallback(async () => {
      setLoading(true);
      console.log(twitterName, 'tiwttiername');
      console.log(account, 'account');
      console.log(connector, 'connector');
      const erc20 =
        accountPair?.filter((item) => item.key === currentCoin)?.[0].contract ||
        0;

      if (erc20 == 0) {
        // 选择的是MATIC
        console.log('send MATIC');
        const res = await sendETH(connector, twitterName, account);
        setLoading(false);
        back?.();
        message.success('send success.');
        console.log(res, 'reshash =====');
      } else {
        // 选择的是MATIC
        console.log('send ERC20');
        const res = await sendERC20(connector, erc20, twitterName, account);
        setLoading(false);
        back?.();
        message.success('send success.');
        console.log(res, 'reshash =====');
      }

      // debugger;

      //   const res = await sendETH(connector, twitterName, account);
      //   setLoading(false);
      //   back?.();
      //   message.success('send success.');
      //   console.log(res, 'reshash =====');
    }, [account, back, connector, sendETH, twitterName]);

    React.useImperativeHandle(ref, () => ({
      handleSendClick,
    }));

    const coinOptions = useMemo(
      () =>
        accountPair?.map((item) => ({
          value: item.key,
          label: item.name,
        })),
      [accountPair]
    );

    useEffect(() => {
      handleLoading?.(loading);
    }, [handleLoading, loading]);

    return (
      <>
        <div className="flex justify-center item-style">
          <div className="label-style">
            <Select
              defaultValue={accountPair?.[0].key}
              style={{
                width: 120,
              }}
              onChange={setCurrentCoin}
              options={coinOptions}
            />
          </div>
          <div className="input-style flex justify-start font-medium leading-10">
            {accountPair?.filter((item) => item.key === currentCoin)?.[0]
              .account || 0}
          </div>
        </div>

        <div className="flex justify-center item-style">
          <div className="label-style">Amount</div>
          <input
            type="text"
            value={account}
            onChange={handleAccountChange}
            className="input-style"
          />
        </div>
        <div className="flex justify-center item-style">
          <div className="label-style">Twitter Name</div>
          <input
            type="text"
            value={twitterName}
            placeholder="name or address"
            onChange={handleNameChange}
            onBlur={handleGetAddress}
            className="input-style"
          />
        </div>

        <div className="flex justify-center item-style">
          <div className="label-style">Target Address</div>
          <div className="input-style flex justify-start font-medium leading-10">
            {addressFormat(targetAddress)}
          </div>
        </div>
      </>
    );
  }
);

export default Send;
