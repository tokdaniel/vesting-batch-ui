import { component$, Signal, useSignal } from "@builder.io/qwik";
import metadata from "@superfluid-finance/metadata";

export type Network = (typeof metadata.networks)[number];

export interface NetworkSelectProps {
  selectedNetwork: Signal<Network>;
  onNetworkSelect: (network: Network) => void;
}

export const NetworkSelect = component$<NetworkSelectProps>(
  ({ selectedNetwork, onNetworkSelect }) => {
    const showTestNets = useSignal(false);

    return (
      <div class="flex gap-2 items-center">
        <select
          class="p-2 rounded-md w-52"
          onChange$={({ target }) =>
            onNetworkSelect(metadata.getNetworkByName(target.value)!)
          }
        >
          {metadata.networks
            .filter(({ isTestnet }) => (showTestNets.value ? true : !isTestnet))
            .map(({ name, chainId }) => (
              <option
                value={name}
                key={chainId}
                selected={
                  selectedNetwork.value === metadata.getNetworkByName(name)
                }
              >
                {name}
              </option>
            ))}
        </select>
        <div class="flex items-center">
          <input
            id="default-checkbox"
            type="checkbox"
            checked={showTestNets.value}
            onChange$={({ target }) => (showTestNets.value = target.checked)}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="default-checkbox"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Testnets
          </label>
        </div>
      </div>
    );
  }
);
