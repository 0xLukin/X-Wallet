import React, { useState, useRef } from 'react';

import {
  usePrepareContractBatchWrite,
  useContractBatchWrite,
} from '@zerodev/wagmi';
import { useAccount, useWaitForTransaction } from 'wagmi';
import { NFT_Contract_Abi } from '../config/contractAbi';

const contractAbi = NFT_Contract_Abi;

export default function MintButton() {
  const { address, connector, isConnected } = useAccount();
  const nftAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863';
  const { config } = usePrepareContractBatchWrite({
    calls: [
      {
        address: nftAddress,
        abi: contractAbi,
        functionName: 'mint',
        args: [address],
      },
      {
        address: nftAddress,
        abi: contractAbi,
        functionName: 'mint',
        args: [address],
      },
    ],
    enabled: true,
  });
  const {
    sendUserOperation: batchMint,
    isLoading,
    data,
    error,
  } = useContractBatchWrite(config);

  useWaitForTransaction({
    hash: data ? data.hash : undefined,
    enabled: !!data,
    onSuccess() {
      console.log('Transaction was successful.');
    },
    onError() {
      alert('Transaction was unsuccessful.');
    },
  });

  return (
    <div className="">
      <button disabled={isLoading} onClick={() => batchMint()}>
        {isLoading ? 'loading...' : 'Mint NFT'}
      </button>
    </div>
  );
}
