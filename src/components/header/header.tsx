"use client";

import LensLoginButton from "../lens-login-button/lens-login-button";

export default function Header() {
  return (
    <main className="bg-emerald-600 grid grid-cols-3 items-center p-2">
      <h1 className="text-3xl font-bold col-start-2 justify-self-center font-satisfy text-red-200">
        {" "}
        GoodVibesHub 🤗{" "}
      </h1>
      <div className="col-start-3  justify-self-end h-fit">
        <LensLoginButton />
      </div>
    </main>
  );
}
