import {
  QwikChangeEvent,
  component$,
  useSignal,
  $,
  noSerialize,
  useTask$,
  Signal,
} from "@builder.io/qwik";
import {
  VestingSchedule,
  validateFields,
  parseVestingSchedule,
  getTxBuilderInput,
} from "../../utils/vestingSchedule";
import { Network, NetworkSelect } from "../network-select/network-select";
import { formatEther } from "viem";
import { shortenHex } from "../../utils/address";

export interface ContentProps {
  selectedNetwork: Signal<Network>;
  onNetworkSelect: (network: Network) => void;
}

export const Content = component$<ContentProps>(
  ({ selectedNetwork, onNetworkSelect }) => {
    const file = useSignal<File>();
    const csv = useSignal<VestingSchedule[]>();
    const jsonUrl = useSignal<string>();

    const triggerFileSelect = $(() => {
      const input = document.getElementById("imgupload") as HTMLInputElement;
      input.click();
    });

    const selectFile = $(({ target }: QwikChangeEvent<HTMLInputElement>) => {
      if (!target.files) return;

      file.value = noSerialize(target.files[0]);
    });

    useTask$(async ({ track }) => {
      track(() => file.value);

      if (!file.value) return;

      const reader = new FileReader();
      reader.readAsText(file.value);
      reader.onload = async () => {
        const [_, ...rows] = (reader.result as string).split("\n");

        csv.value = rows.map(parseVestingSchedule).filter(validateFields);
      };
    });

    useTask$(async ({ track }) => {
      track(() => csv.value);
      track(() => selectedNetwork.value);

      if (csv.value) {
        const safeTxBuilderJSON = getTxBuilderInput(selectedNetwork.value)(
          csv.value
        );

        const blob = new Blob([JSON.stringify(safeTxBuilderJSON)], {
          type: "application/json",
        });

        const url = URL.createObjectURL(blob);

        jsonUrl.value = url;
      }
    });

    return (
      <div class="flex flex-col gap-4 items-center">
        <h3 class="text-2xl">
          Superfluid VestingSchedule Batch Generator for Safe Tx Builder
        </h3>
        <div class="flex gap-2">
          <button class="w-52" onClick$={triggerFileSelect}>
            Browse Vesting CSV
          </button>
          <input
            onChange$={selectFile}
            type="file"
            accept=".csv"
            id="imgupload"
            style="display:none"
          />
          <NetworkSelect
            selectedNetwork={selectedNetwork}
            onNetworkSelect={onNetworkSelect}
          />
        </div>

        {csv.value && (
          <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-left text-sm font-light">
                    <thead class="border-b bg-white font-medium dark:border-neutral-500 dark:bg-neutral-600">
                      <tr>
                        <th scope="col" class="px-6 py-4">
                          SuperToken
                        </th>
                        <th scope="col" class="px-6 py-4">
                          Receiver
                        </th>
                        <th scope="col" class="px-6 py-4">
                          StartDate
                        </th>
                        <th scope="col" class="px-6 py-4">
                          CliffDate
                        </th>
                        <th scope="col" class="px-6 py-4">
                          EndDate
                        </th>
                        <th scope="col" class="px-6 py-4">
                          FlowRate
                        </th>
                        <th scope="col" class="px-6 py-4">
                          CliffAmount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {csv.value.map(
                        (
                          {
                            token,
                            receiver,
                            startTs,
                            cliffTs,
                            endTs,
                            flowRate,
                            cliffAmount,
                          },
                          i
                        ) => (
                          <tr
                            class={`border-b bg-neutral-100 dark:border-neutral-500 ${
                              i % 2 === 0
                                ? "dark:bg-neutral-700"
                                : "dark:bg-neutral-600"
                            } `}
                          >
                            <td class="whitespace-nowrap px-6 py-4">
                              {shortenHex(token)}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                              {shortenHex(receiver)}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                              {startTs
                                ? new Date(startTs * 1000)
                                    .toISOString()
                                    .split(".")[0]
                                : "-"}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                              {cliffTs
                                ? new Date(cliffTs * 100)
                                    .toISOString()
                                    .split(".")[0]
                                : "-"}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                              {endTs
                                ? new Date(endTs * 1000)
                                    .toISOString()
                                    .split(".")[0]
                                : "-"}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                              {flowRate.toString()}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                              {formatEther(cliffAmount)} eth
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {jsonUrl.value && (
          <a href={jsonUrl.value} target="_blank">
            <button>Download Safe TxBuilder JSON</button>
          </a>
        )}
      </div>
    );
  }
);
