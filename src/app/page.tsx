"use client";

import Header from "@/components/header/header";
import { use, useEffect, useState } from "react";

// WAGMI

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

// LENS

import { LensProvider } from "@lens-protocol/react-web";
import { LensConfig, development, production } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: production,
};

import Feed from "@/components/feed/feed";

export default function Home() {
  const [profileId, setProfileId] = useState<string | null>(null);

  // const { data: activeProfile, error, loading } = useActiveProfile();

  // useEffect(() => {
  //   console.log({ activeProfile });
  //   console.log({ error });
  //   console.log({ loading });
  // }, [activeProfile, error, loading]);

  return (
    <WagmiConfig config={config}>
      <LensProvider config={lensConfig}>
        <div>
          <Header />
          <main className="w-screen h-[calc(100vh-3.5rem)] flex flex-row">
            <div
              className="basis-1/4 flex justify-center items-start"
              style={{
                fontSize: "150px",
              }}>
              {" "}
              🍀{" "}
            </div>
            <div className="basis-2/4 overflow-scroll	space-y-2">
              <Feed />
            </div>
            <div
              className="basis-1/4 flex justify-center content-end items-end"
              style={{
                fontSize: "150px",
              }}>
              {" "}
              🍀{" "}
            </div>
          </main>
        </div>
      </LensProvider>
    </WagmiConfig>
  );
}
