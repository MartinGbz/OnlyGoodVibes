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

import Image from "next/image";
import lensIcon from "@/medias/icons/lens-icon-T-Green.svg";

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
  }, [isConnected]);

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
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
    <Button
      className="h-10"
      variant="defaultlens"
      disabled={isLoginPending || isLogoutPending || activeWalletLoading}
      onClick={isWalletConnected && wallet ? onLogoutClick : onLoginClick}>
      <Image className="md:mr-2 h-7 w-7" src={lensIcon} alt={""} />
      {!(isLoginPending || isLogoutPending || activeWalletLoading) &&
        wallet && (
          <p className="hidden md:flex">
            {wallet.address.substring(0, 6) + "... Logout"}
          </p>
        )}
      {!(isLoginPending || isLogoutPending || activeWalletLoading) &&
        !wallet && <p className="hidden md:flex">Login w/ Lens</p>}
      {(isLoginPending || isLogoutPending || activeWalletLoading) && (
        <p className="hidden md:flex">Loading...</p>
      )}
    </Button>
  );
}
