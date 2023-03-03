import { Dapp } from "@/types/dapp";
import { Metaplex } from "@metaplex-foundation/js";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { getUrls, NETWORK } from ".";

export const getFieldSpans = (schema: any) => {
  const spans = [];
  for (const field of schema.fields) {
    if (field.span >= 0) {
      spans.push(field.span);
    } else if (field.layout) {
      spans.push(field.layout.span);
    }
  }
  return spans;
};

export const serialize = (schema: any, data: any) => {
  const buffer = Buffer.alloc(1000);
  schema.encode({ ...data }, buffer);
  return buffer.slice(0, schema.getSpan(buffer));
};

export const deserialize = (schema: any, buffer?: Buffer) => {
  if (!buffer) {
    return null;
  }

  try {
    const data = schema.decode(buffer);
    return data;
  } catch (e) {
    console.log("Deserialization error:", e);
    return null;
  }
};

export class DataType {
  dataTypeString: string;
  constructor(dataType: string) {
    this.dataTypeString = dataType;
  }
  toUint8Array = () => {
    return anchor.utils.bytes.utf8
      .encode(anchor.utils.sha256.hash(this.dataTypeString))
      .slice(0, 8);
  };
  toArray = () => {
    return Array.from(this.toUint8Array());
  };
}

export class DappClient {
  program: Program<Dapp>;
  owner: PublicKey;
  dataType: DataType;

  constructor(program: Program<Dapp>, owner: PublicKey, dataType: DataType) {
    this.program = program;
    this.owner = owner;
    this.dataType = dataType;
  }

  findProgramAddressSync = (solSyncCoreProgram: anchor.web3.PublicKey) => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("dapp"),
        this.owner.toBuffer(),
        this.dataType.toUint8Array(),
      ],
      solSyncCoreProgram
    );
  };

  mintRewardTokens = async (
    connection: Connection,
    sendTransaction: (
      transaction: Transaction | VersionedTransaction,
      connection: Connection
    ) => Promise<string>,
    solSyncCoreProgram: PublicKey
  ) => {
    try {
      const [dapp, bump] = this.findProgramAddressSync(solSyncCoreProgram);
      const mint = new anchor.web3.PublicKey(
        "HmMb1WvgFH34DAHpWDQt1BAB3gDedMETArcun3tTWgm3"
      );
      const ownerTokenAccount = getAssociatedTokenAddressSync(mint, this.owner);
      const metaplex = Metaplex.make(this.program.provider.connection);

      const metadata = metaplex.nfts().pdas().metadata({ mint });
      console.log("Metadata:", metadata.toBase58());
      const [programAuth] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("program_auth")],
        this.program.programId
      );
      const recentBlockhash = await connection.getLatestBlockhash();
      const tx = new Transaction({
        recentBlockhash: recentBlockhash?.blockhash,
      });
      tx.add(
        await this.program.methods
          .mintRewards(this.dataType.toArray())
          .accounts({
            dapp,
            programAuth,
            owner: this.owner,
            ownerTokenAccount,
            mint,
            solSyncCoreProgram,
          })
          .signers([])
          .transaction()
      );
      const sig = await sendTransaction(tx, connection);
      console.log("mintRewardTokens", getUrls(NETWORK, sig, "tx").explorer);
      return sig;
    } catch (error) {
      console.log(error);
    }
  };
}
