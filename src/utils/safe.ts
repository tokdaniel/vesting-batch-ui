import { SHA3 } from "sha3";
import { Address } from "viem";

export type Transaction = {
  to: Address;
  value: string;
  data: any;
  contractMethod: any;
  contractInputsValues: {
    [key: string]: string;
  };
};

export type SafeTxBuilderInput = {
  version: string;
  chainId: string;
  createdAt: string;
  meta: {
    name: string;
    description: string;
    txBuilderVersion: "1.16.1";
    createdFromSafeAddress: Address | "";
    createdFromOwnerAddress: Address | "";
    checksum: string;
  };
  transactions: Transaction[];
};
const serializeJSONObject = (json: any): string => {
  const stringifyReplacer = (_: string, value: any) =>
    value === undefined ? null : value;

  if (Array.isArray(json)) {
    return `[${json.map((el) => serializeJSONObject(el)).join(",")}]`;
  }

  if (typeof json === "object" && json !== null) {
    let acc = "";
    const keys = Object.keys(json).sort();
    acc += `{${JSON.stringify(keys, stringifyReplacer)}`;

    for (let i = 0; i < keys.length; i++) {
      acc += `${serializeJSONObject(json[keys[i]])},`;
    }

    return `${acc}}`;
  }

  return `${JSON.stringify(json, stringifyReplacer)}`;
};

export const calculateChecksum = (batchFile: SafeTxBuilderInput): string => {
  const serialized = serializeJSONObject({
    ...batchFile,
    meta: { ...batchFile.meta, name: null },
  });
  const sha = `0x${new SHA3(256).update(serialized).digest("hex")}`;

  return sha;
};
