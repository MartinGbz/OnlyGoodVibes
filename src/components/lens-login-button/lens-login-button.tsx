"use client";

import {
  useWalletLogin,
  useWalletLogout,
  useActiveWallet,
} from "@lens-protocol/react-web";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Button } from "@/components/ui/button";

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

  const onLogoutClick = async () => {
    await disconnectAsync();
    await logout();
  };

  return (
    <div>
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
