"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("./components/Game"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-emerald-50 text-emerald-700 text-sm">
      Carregando…
    </div>
  ),
});

export default function Home() {
  return <Game />;
}
