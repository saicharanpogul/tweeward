import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useEffect, useState } from "react";

const useLocalWallet = () => {
  const [balance, setBalance] = useState(0);
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const getBalance = useCallback(async () => {
    try {
      if (!walletAdapter.connected && !walletAdapter.publicKey)
        return setBalance(0);
      const _balance = await connection.getBalance(
        walletAdapter.publicKey as PublicKey
      );
      setBalance(_balance);
    } catch (error) {
      console.log(error);
    }
  }, [connection, walletAdapter.connected, walletAdapter.publicKey]);
  useEffect(() => {
    getBalance();
  }, [walletAdapter.connected, walletAdapter.publicKey]);
  return { balance, getBalance };
};

export default useLocalWallet;
