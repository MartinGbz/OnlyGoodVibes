"use client";

import LensLoginButton from "../lens-login-button/lens-login-button";

export default function Header() {
  return (
    <main className="bg-emerald-600 grid grid-cols-3 items-center p-2">
      <div className="col-start-2 justify-self-center flex space-x-2">
        <h1 className="text-xl md:text-3xl font-satisfy text-red-200">
          {" "}
          OnlyGoodVibes{" "}
        </h1>
        <h1 className="text-xl md:text-3xl">🤗</h1>
      </div>
      <div className="col-start-3  justify-self-end h-fit">
        <LensLoginButton />
      </div>
    </main>
  );
}
