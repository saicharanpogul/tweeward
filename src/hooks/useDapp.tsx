import { useWorkspace } from "@/components";
import {
  changeProgress,
  selectProgress,
  setCurrentId,
} from "@/store/progressSlice";
import { Dapp } from "@/types/dapp";
import { getUrls, NETWORK } from "@/utils";
import {
  DappClient,
  DataType,
  deserialize,
  getFieldSpans,
  serialize,
} from "@/utils/dapp";
import { Tweeward } from "@/utils/firebase";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import * as borsh from "@project-serum/borsh";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSolSyncCore from "./useSolSyncCore";
import useTransactionToast from "./useTransactionToast";

const useDapp = () => {
  const { connection, dappProgram, solSyncCoreProgram, solSyncCoreProgramId } =
    useWorkspace();
  const walletAdapter = useWallet();
  const { updateDapp } = useSolSyncCore();
  const dispatch = useDispatch();
  const progressState = useSelector(selectProgress);
  const transactionToast = useTransactionToast();
  const router = useRouter();

  const getTweet = useCallback(async () => {
    if (!walletAdapter.publicKey || !walletAdapter.connected) {
      return;
    }
    try {
      const tweeward = new Tweeward(
        walletAdapter.publicKey?.toBase58() as string
      );
      const fetchedData = await tweeward.getStat(
        progressState.currentId as string
      );
      // console.log("FETCHED:", fetchedData);
      return fetchedData;
    } catch (error) {
      console.log(error);
    }
  }, [
    progressState.currentId,
    walletAdapter.connected,
    walletAdapter.publicKey,
  ]);

  const blackbox = useCallback(
    async (fetchedData: any) => {
      if (!walletAdapter.publicKey || !walletAdapter.connected) {
        return;
      }
      try {
        solSyncCoreProgram?.addEventListener(
          "DappEvent",
          async (event, slot, signature) => {
            const dappClient = new DappClient(
              dappProgram as Program<Dapp>,
              walletAdapter.publicKey as PublicKey,
              new DataType("StreamDataV1")
            );
            console.log("fetched", fetchedData);
            const data = {
              impression_count: new anchor.BN(fetchedData.impression_count),
              like_count: new anchor.BN(fetchedData.like_count),
              quote_count: new anchor.BN(fetchedData.quote_count),
              reply_count: new anchor.BN(fetchedData.reply_count),
              retweet_count: new anchor.BN(fetchedData.retweet_count),
            };
            console.log("prepared", data);
            // const data = {
            //   impression_count: new anchor.BN(77647),
            //   like_count: new anchor.BN(299),
            //   quote_count: new anchor.BN(11),
            //   reply_count: new anchor.BN(64),
            //   retweet_count: new anchor.BN(89),
            // };
            const schema = borsh.struct([
              borsh.u64("impression_count"),
              borsh.u64("like_count"),
              borsh.u64("quote_count"),
              borsh.u64("reply_count"),
              borsh.u64("retweet_count"),
            ]);
            const spans = getFieldSpans(schema);

            if (event.ix.init) {
              console.log("INITIALIZE SUCCESS");
              console.log("SERIALIZED_DATA:", serialize(schema, data));
              console.log(
                "DESERIALIZED_DATA:",
                deserialize(schema, serialize(schema, data))
              );
              console.log("DATA:", serialize(schema, data));
              console.log("SPANS:", spans);
              const [dapp, bump] = dappClient?.findProgramAddressSync(
                solSyncCoreProgram?.programId as PublicKey
              );
              await updateDapp(
                dapp,
                walletAdapter.publicKey as PublicKey,
                serialize(schema, data),
                Buffer.from(spans)
              );
              dispatch(changeProgress("updated"));
            }

            if (event.ix.update) {
              console.log("UPDATE SUCCESS");
              const sig = await dappClient.mintRewardTokens(
                connection as Connection,
                walletAdapter.sendTransaction,
                solSyncCoreProgram.programId
              );
              transactionToast(sig as string, "tx");
            }

            if (event.ix.close) {
              dispatch(changeProgress("closed"));
              console.log("CLOSE SUCCESS");
              dispatch(setCurrentId(""));
            }
          }
        );
      } catch (error) {
        console.log(error);
        dispatch(setCurrentId(""));
        dispatch(changeProgress(undefined));
      }
    },
    [
      connection,
      dappProgram,
      dispatch,
      solSyncCoreProgram,
      updateDapp,
      walletAdapter.connected,
      walletAdapter.publicKey,
      walletAdapter.sendTransaction,
    ]
  );

  const init = useCallback(() => {
    if (!walletAdapter.publicKey || !walletAdapter.connected) {
      return;
    }
    const dappClient = new DappClient(
      dappProgram as Program<Dapp>,
      walletAdapter.publicKey as PublicKey,
      new DataType("StreamDataV1")
    );
    console.log("DATA_TYPE:", dappClient.dataType.dataTypeString);
    const [dapp, bump] = dappClient.findProgramAddressSync(
      solSyncCoreProgram?.programId as PublicKey
    );
    console.log("BLACKBOX:DAPP:", dapp.toBase58());
  }, [
    dappProgram,
    solSyncCoreProgram?.programId,
    walletAdapter.connected,
    walletAdapter.publicKey,
  ]);

  useEffect(() => {
    if (progressState.currentId) {
      getTweet().then((data) => {
        blackbox(data);
      });
    } else {
      init();
    }
  }, [blackbox, init, progressState.currentId]);

  const initializeSolSyncCore = useCallback(
    async (onModalClose: () => void) => {
      try {
        const recentBlockhash = await connection?.getLatestBlockhash();
        const tx = new Transaction({
          recentBlockhash: recentBlockhash?.blockhash,
        });
        const dappClient = new DappClient(
          dappProgram as Program<Dapp>,
          walletAdapter.publicKey as PublicKey,
          new DataType("StreamDataV1")
        );
        const [dapp, bump] = dappClient?.findProgramAddressSync(
          solSyncCoreProgram?.programId as PublicKey
        );
        tx.add(
          (await dappProgram?.methods
            .initializeSolSync(dappClient?.dataType.toArray())
            .accounts({
              dapp,
              owner: walletAdapter.publicKey as PublicKey,
              solSyncCoreProgram: solSyncCoreProgramId,
            })
            .signers([])
            .transaction()) as Transaction
        );
        const sig = await walletAdapter.sendTransaction(
          tx,
          connection as Connection
        );
        console.log("InitializeSolSync", getUrls(NETWORK, sig, "tx").explorer);
        dispatch(changeProgress("initialized"));
      } catch (error) {
        console.log(error);
        dispatch(setCurrentId(""));
        dispatch(changeProgress(undefined));
        onModalClose();
      }
    },
    [
      connection,
      dappProgram,
      dispatch,
      solSyncCoreProgram?.programId,
      solSyncCoreProgramId,
      walletAdapter,
    ]
  );
  return { initializeSolSyncCore };
};

export default useDapp;
