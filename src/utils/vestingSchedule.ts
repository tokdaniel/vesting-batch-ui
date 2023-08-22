import { isAddress, Address } from "viem";
import Abi from "../abi/VestingSchedulerABI";
import { SafeTxBuilderInput, Transaction, calculateChecksum } from "./safe";
import metadata from "@superfluid-finance/metadata";
import { Network } from "../components/network-select/network-select";

export interface VestingSchedule {
  token: Address;
  receiver: Address;
  flowRate: bigint;
  startTs: number;
  cliffTs: number;
  cliffAmount: bigint;
  endTs: number;
}

export const parseVestingSchedule = (row: string): VestingSchedule => {
  const [token, receiver, flowRate, startTs, cliffTs, cliffAmount, endTs] =
    row.split(",");

  return {
    token: token as Address,
    receiver: receiver as Address,
    flowRate: BigInt(flowRate),
    startTs: Number(startTs),
    cliffTs: Number(cliffTs),
    cliffAmount: BigInt(cliffAmount),
    endTs: Number(endTs),
  };
};

// prettier-ignore
export const validateFields = (schedule: VestingSchedule) =>
  Boolean(schedule.token && isAddress(schedule.token) &&
  schedule.receiver && isAddress(schedule.receiver) &&
  typeof schedule.flowRate === "bigint" && 
  typeof schedule.cliffAmount === "bigint" &&
  !isNaN(schedule.startTs) &&
  !isNaN(schedule.cliffTs) &&
  !isNaN(schedule.endTs));

export const getCreateVestingScheduleTx =
  (schedulerAddress: Address) =>
  ({
    token,
    receiver,
    startTs,
    cliffTs,
    endTs,
    flowRate,
    cliffAmount,
  }: VestingSchedule): Transaction => ({
    to: schedulerAddress,
    value: "0",
    data: null,
    contractMethod: Abi.filter(
      (x) => x.type === "function" && x.name === "createVestingSchedule"
    )[0],
    contractInputsValues: {
      superToken: token,
      receiver: receiver,
      startDate: startTs.toString(),
      cliffDate: cliffTs.toString(),
      flowRate: flowRate.toString(),
      cliffAmount: cliffAmount.toString(),
      endDate: endTs.toString(),
      ctx: "0x",
    },
  });

export const getTxBuilderInput =
  (network: Network) =>
  (schedules: VestingSchedule[]): SafeTxBuilderInput => {
    const txBuilderInput: SafeTxBuilderInput = {
      version: "1.0",
      chainId: network.chainId.toString(),
      createdAt: Date.now().toString(),
      meta: {
        name: "Superfluid VestingScheduler Transactions Batch",
        description:
          "Batch of transactions to create Superfluid VestingSchedules",
        txBuilderVersion: "1.16.1",
        createdFromSafeAddress: "",
        createdFromOwnerAddress: "",
        checksum: "",
      },
      transactions: [],
    };

    const schedulerAddress = metadata.getNetworkByChainId(network.chainId)
      ?.contractsV1.vestingScheduler as Address;

    if (!schedulerAddress) {
      throw new Error(
        `VestingScheduler contract address not found for chain ${network.name}`
      );
    }

    const transactions = schedules.map(
      getCreateVestingScheduleTx(schedulerAddress)
    );

    txBuilderInput.transactions = transactions;
    txBuilderInput.meta.checksum = calculateChecksum(txBuilderInput);

    return txBuilderInput;
  };
