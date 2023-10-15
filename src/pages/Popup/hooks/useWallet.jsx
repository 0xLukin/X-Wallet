import { useCallback, useContext, useState } from 'react';
import { configureChains, useConnect, useBalance, useDisconnect } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { TwitterSocialWalletConnector } from '@zerodev/wagmi';
import { ECDSAProvider, getRPCProviderOwner } from '@zerodev/sdk';
import { NFT_Contract_Abi } from '../config/contractAbi';
import { encodeFunctionData, parseEther } from 'viem';

const contractAbi = NFT_Contract_Abi;
const nftAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);
const connector = new TwitterSocialWalletConnector({
  chains,
  options: {
    projectId: 'fc514f35-ed25-4100-97e6-90dd298a5d64',
    index: '1',
  },
});

export const useWallet = () => {
  let ecdsaProvider;

  const [ecdsaProvider_global, setEcdsaProvider_global] = useState(null);
  const [account_address, setAccount_address] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { connect, connectAsync } = useConnect();
  const { disconnect: disconnected } = useDisconnect();
  const { data: account_balance, isError } = useBalance({
    address: account_address,
  });

  const getaddress = async (handle) => {
    const requestBody = JSON.stringify({
      handle,
    });
    const response = await fetch(
      'https://x-wallet-backend.vercel.app/api/getAddress',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      }
    );
    return await response.json();
  };

  const deploy = async (handle, newOwner) => {
    const requestBody = JSON.stringify({
      handle: handle,
      newOwner: newOwner,
    });
    const response = await fetch(
      'https://x-wallet-backend.vercel.app/api/deploy',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      }
    );
    return await response.json();
  };

  const login = useCallback(async () => {
    setIsLoading(true);
    console.log('twitter');
    const res = await connectAsync({
      connector: connector,
    });
    // 查询地址和owner
    const handle = await res.connector.web3Auth.getUserInfo();
    const owner = await res.connector.owner.getAddress();
    console.log(owner);
    // 查询accountaddress
    const addressInHandle = await getaddress(handle.name);
    console.log(handle.name);
    console.log('account_address:' + addressInHandle['account_address']);

    // 如果已经部署了就会抛出错误
    try {
      const re = await deploy(handle.name, owner);
      console.log(re);
    } catch (err) {
      console.log(err);
    }
    ecdsaProvider = await ECDSAProvider.init({
      projectId: 'fc514f35-ed25-4100-97e6-90dd298a5d64',
      owner: getRPCProviderOwner(res.connector.web3Auth.provider),
      opts: {
        accountConfig: {
          accountAddress: addressInHandle['account_address'],
        },
      },
    });
    //   console.log(ecdsaProvider);
    //   console.log(await ecdsaProvider.getAddress());
    // 设置全局ecdsaProvider
    console.log('twitter---------' + handle.name);

    setAccount_address(addressInHandle['account_address']);
    setAccountName(handle.name);
    setEcdsaProvider_global(ecdsaProvider);
    setIsConnected(true);
    localStorage.setItem('handleName', handle.name);
    localStorage.setItem('accountAddress', addressInHandle['account_address']);
    // sessionStorage.setItem('ecdsaProvider', JSON.stringify(ecdsaProvider));

    console.log(ecdsaProvider);
    setIsLoading(false);

    // routerContext.routeTo('/home');

    // 无gas mint test
    //   await mintNft();
    //   await sendETH('0xLuki 🥤', parseEther('0.001'));
    //   await disConnect();

    // routerContext.routeTo('/home');
    return handle.name;
  }, [setAccountName]);

  const mintNft = useCallback(async () => {
    const account_address = await ecdsaProvider.getAddress();
    // console.log(account_address);
    const { hash } = await ecdsaProvider.sendUserOperation({
      target: nftAddress,
      data: encodeFunctionData({
        abi: contractAbi,
        functionName: 'mint',
        args: [account_address],
      }),
    });
    return hash;
  }, [ecdsaProvider]);

  const sendETH = useCallback(
    async (connector, targe, value) => {
      const ecdsaProvider = await ECDSAProvider.init({
        projectId: 'fc514f35-ed25-4100-97e6-90dd298a5d64',
        owner: getRPCProviderOwner(connector.web3Auth.provider),
        opts: {
          accountConfig: {
            accountAddress: localStorage.getItem('accountAddress'),
          },
        },
      });

      console.log(ecdsaProvider);
      const to_address = await getaddress(targe);
      console.log('to_address:' + to_address['account_address']);
      const { hash } = await ecdsaProvider.sendUserOperation({
        target: to_address['account_address'],
        data: '0x',
        value: parseEther(value),
      });
      console.log(hash);
      return hash;
    },
    [ecdsaProvider]
  );

  const disConnect = useCallback(async () => {
    setIsConnected(false);
    setEcdsaProvider_global(null);
    setAccount_address('');
    setIsLoading(false);
    ecdsaProvider = null;
    disconnected();
    // console.log(account_address);
    // ecdsaProvider.dis .then((res) => {
    //   console.log(res);
    // });
  }, []);

  return {
    getaddress,
    login,
    sendETH,
    mintNft,
    ecdsaProvider_global,
    account_address,
    accountName,
    isLoading,
    setIsLoading,
    account_balance,
    isConnected,
    disConnect,
    ecdsaProvider,
  };
};
