import { useWorkspace } from "@/components";
import { getUrls, NETWORK } from "@/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import React, { useCallback } from "react";

const useSolSyncCore = () => {
  const { solSyncCoreProgram } = useWorkspace();
  const walletAdapter = useWallet();
  const { connection } = useConnection();

  const updateDapp = useCallback(
    async (dapp: PublicKey, owner: PublicKey, data: any, spans: Buffer) => {
      try {
        console.log("Update Dapp");
        const recentBlockhash = await connection.getLatestBlockhash();
        const tx = new Transaction({
          recentBlockhash: recentBlockhash?.blockhash,
        });
        tx.add(
          (await solSyncCoreProgram?.methods
            .updateDapp(data, spans)
            .accounts({
              dapp,
              owner,
            })
            .transaction()) as Transaction
        );
        const sig = await walletAdapter.sendTransaction(
          tx,
          connection as Connection
        );
        console.log("Update", getUrls(NETWORK, sig, "tx").explorer);
        const fetchedDapp = await solSyncCoreProgram?.account.dapp.fetch(dapp);
        console.log(fetchedDapp);
      } catch (error) {
        console.log(error);
      }
    },
    [
      connection,
      solSyncCoreProgram?.account.dapp,
      solSyncCoreProgram?.methods,
      walletAdapter,
    ]
  );
  return { updateDapp };
};

export default useSolSyncCore;
