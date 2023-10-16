"use client";

import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai, polygon],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      options: {
        shimDisconnect: false, // see https://github.com/wagmi-dev/wagmi/issues/2511
      },
    }),
  ],
});

import { LensConfig, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};

import { LensProvider } from "@lens-protocol/react-web";

import LensLoginButton from "../lens-login-button/lens-login-button";

export default function Header() {
  return (
    <WagmiConfig config={config}>
      <LensProvider config={lensConfig}>
        <main className="bg-green-500 grid grid-cols-3 items-center p-2">
          <h1 className="text-white text-2xl font-bold col-start-2 justify-self-center">
            {" "}
            GoodVibesHub 🤗{" "}
          </h1>
          <div className="col-start-3  justify-self-end">
            <LensLoginButton />
          </div>
        </main>
      </LensProvider>
    </WagmiConfig>
  );
}
