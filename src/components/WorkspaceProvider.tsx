import { createContext, useContext } from "react";
import {
  AnchorProvider,
  Idl,
  Program,
  setProvider,
} from "@project-serum/anchor";
import { Dapp, IDL as DappIDL } from "../types/dapp";
import { SolSyncCore, IDL as SolSyncCoreIDL } from "../types/sol_sync_core";
import dappIdl from "../constants/dapp.json";
import solSyncCoreIdl from "../constants/sol_sync_core.json";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const WorkspaceContext = createContext({});

interface Workspace {
  connection?: Connection;
  provider?: AnchorProvider;
  dappProgram?: Program<Dapp>;
  solSyncCoreProgram?: Program<SolSyncCore>;
  dappProgramId?: PublicKey;
  solSyncCoreProgramId?: PublicKey;
}

const MockWallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: (transaction: Transaction) => Promise.resolve(transaction),
  signAllTransactions: (transactions: Transaction[]) =>
    Promise.resolve(transactions),
};

const WorkspaceProvider = ({ children }: any) => {
  const dappProgramId = new PublicKey(dappIdl.metadata.address);
  const solSyncCoreProgramId = new PublicKey(solSyncCoreIdl.metadata.address);
  const wallet = useAnchorWallet() || MockWallet;
  const { connection } = useConnection();
  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);
  const dappProgram = new Program(DappIDL as Idl, dappProgramId);
  const solSyncCoreProgram = new Program(
    SolSyncCoreIDL as Idl,
    solSyncCoreProgramId
  );

  const workspace = {
    connection,
    provider,
    dappProgram,
    solSyncCoreProgram,
    dappProgramId,
    solSyncCoreProgramId,
  };

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
};

const useWorkspace = (): Workspace => {
  return useContext(WorkspaceContext);
};

export { WorkspaceProvider, useWorkspace };
