"use client";

import {
  useWalletLogin,
  useWalletLogout,
  useActiveWallet,
  useFeed,
  useActiveProfile,
  useProfilesOwnedByMe,
} from "@lens-protocol/react-web";
import { use, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Button } from "@/components/ui/button";

// import { LensClient, development } from "@lens-protocol/client";

// const lensClient = new LensClient({
//   environment: development,
// });

export default function LensLoginButton() {
  // LENS
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { execute: logout, isPending: isLogoutPending } = useWalletLogout();

  const { data: wallet, loading: activeWalletLoading } = useActiveWallet();

  // WAGMI

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  useEffect(() => {
    setIsWalletConnected(isConnected);
    console.log({ isConnected });
  }, [isConnected]);

  // useEffect(() => {
  //   if (wallet) {
  //     onChangeAddress(wallet.address);
  //   } else {
  //     onChangeAddress(null);
  //   }
  // }, [onChangeAddress, wallet]);

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
      console.log({ walletClient });
      await login({
        address: walletClient.account.address,
      });
    }
  };

  const { data: profile, error, loading } = useActiveProfile();

  // useEffect(() => {
  //   console.log({ profile });
  //   onChangeProfile(profile?.handle ?? null);
  // }, [onChangeProfile, profile]);

  console.log({ profile });

  // const { data: profiles, error, loading } = useProfilesOwnedByMe();

  // const onLogoutClick = async () => {
  //   console.log("onLogoutClick");
  //   console.log({ wallet });
  //   console.log({ data });
  //   // console.log({ profiles });
  //   console.log({ error });
  //   console.log({ loading });
  // };

  const onLogoutClick = async () => {
    await disconnectAsync();
    await logout();
  };

  return (
    <div>
      {/* {isWalletConnected && <p>WAGMI: Logged in </p>}
      {!isWalletConnected && <p>WAGMI: Not logged in </p>}
      {wallet && <p>LENS: You are logged-in with {wallet.address}</p>}
      {!wallet && <p>LENS: You are NOT logged-in</p>}
      {activeWalletLoading && <p>LENS: Loading...</p>} */}
      <Button
        className="bg-red-200"
        variant="outline"
        disabled={isLoginPending || isLogoutPending}
        onClick={isWalletConnected && wallet ? onLogoutClick : onLoginClick}>
        {!(isLoginPending || isLogoutPending || activeWalletLoading) &&
          wallet &&
          wallet.address.substring(0, 5) + "... Logout"}
        {!(isLoginPending || isLogoutPending || activeWalletLoading) &&
          !wallet &&
          "Login w/ Lens"}
        {(isLoginPending || isLogoutPending || activeWalletLoading) &&
          "Loading..."}
      </Button>
    </div>
  );
}
