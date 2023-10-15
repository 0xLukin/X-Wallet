import { useCallback, useContext, useState } from 'react';
import { configureChains, useConnect, useBalance, useDisconnect } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { TwitterSocialWalletConnector } from '@zerodev/wagmi';
import ctx, { Provider, Consumer } from '../components/appContext';
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

export function useWallet() {
  let ecdsaProvider;
  const [ecdsaProvider_global, setEcdsaProvider_global] = useState(null);
  const [account_address, setAccount_address] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { connect, connectAsync } = useConnect();
  const { disconnect: disconnected } = useDisconnect();
  const { data: account_balance, isError } = useBalance({
    address: account_address,
  });
  const routerContext = useContext(ctx);

  const getaddress = async (handle) => {
    const requestBody = JSON.stringify({
      handle: handle,
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
    connectAsync({
      connector: connector,
    }).then(async (res) => {
      // 查询地址和owner
      const handle = await res.connector.web3Auth.getUserInfo();
      const owner = await res.connector.owner.getAddress();
      console.log(owner);
      // 查询accountaddress
      const account_address = await getaddress(handle.name);
      console.log(handle.name);
      console.log('account_address:' + account_address['account_address']);

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
            accountAddress: account_address['account_address'],
          },
        },
      });
      //   console.log(ecdsaProvider);
      //   console.log(await ecdsaProvider.getAddress());
      // 设置全局ecdsaProvider
      setAccount_address(account_address['account_address']);
      setEcdsaProvider_global(ecdsaProvider);
      setIsConnected(true);

      console.log(ecdsaProvider);
      setIsLoading(false);

      // 无gas mint test
      //   await mintNft();
      //   await sendETH('0xLuki 🥤', parseEther('0.001'));
      await disConnect();
    });

    // routerContext.routeTo('/home');
  }, []);
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
  }, []);
  const sendETH = useCallback(async (targe, value) => {
    const to_address = await getaddress(targe);
    console.log('to_address:' + to_address['account_address']);
    const { hash } = await ecdsaProvider.sendUserOperation({
      target: to_address['account_address'],
      data: '0x',
      value: value,
    });
    console.log(hash);
    return hash;
  }, []);
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
    isLoading,
    setIsLoading,
    account_balance,
    isConnected,
    disConnect,
  };
}