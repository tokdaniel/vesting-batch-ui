import { component$, useSignal, $ } from "@builder.io/qwik";
import "./global.css";

import { Container } from "./components/container/container";
import { Content } from "./components/content/content";
import { Network } from "./components/network-select/network-select";
import metadata from "@superfluid-finance/metadata";

export const App = component$(() => {
  const selectedNetwork = useSignal<Network>(metadata.networks[0]);

  const onNetworkSelect = $((network: Network) => {
    selectedNetwork.value = network;
  });

  return (
    <Container>
      {/* <div q:slot="header">Header</div> */}
      <div q:slot="content">
        <Content
          selectedNetwork={selectedNetwork}
          onNetworkSelect={onNetworkSelect}
        />
      </div>
      {/* <div q:slot="footer">Footer</div> */}
    </Container>
  );
});
